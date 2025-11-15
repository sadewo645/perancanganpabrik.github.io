"""MQTT Sender for PKS Monitoring

This script reads telemetry data from an Arduino via serial port and publishes
it to the HiveMQ public broker using WebSocket-compatible topics for the web
monitoring dashboard.
"""

import json
import random
import time
from dataclasses import dataclass

import paho.mqtt.client as mqtt
import serial


@dataclass
class SensorPayload:
    station: str
    temperature: float
    pressure: float
    rpm: float
    flow: float
    boiler: float
    ph: float

    def to_payload_string(self) -> str:
        return (
            f"station={self.station};"
            f"temp={self.temperature:.2f};"
            f"press={self.pressure:.2f};"
            f"rpm={self.rpm:.0f};"
            f"flow={self.flow:.2f};"
            f"boiler={self.boiler:.2f};"
            f"ph={self.ph:.2f}"
        )


class PKSMQTTSender:
    def __init__(self, port: str, baudrate: int = 9600, topic: str = "pks/telemetry"):
        self.port = port
        self.baudrate = baudrate
        self.topic = topic
        self.client = mqtt.Client()
        self.client.enable_logger()

    def connect(self) -> None:
        self.client.connect("broker.hivemq.com", 1883, keepalive=60)
        self.client.loop_start()

    def disconnect(self) -> None:
        self.client.loop_stop()
        self.client.disconnect()

    def publish_payload(self, payload: SensorPayload) -> None:
        self.client.publish(self.topic, payload.to_payload_string(), qos=0, retain=False)

    def read_serial_frame(self, ser: serial.Serial) -> SensorPayload:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        try:
            data = json.loads(line)
            return SensorPayload(
                station=data.get("station", "sterilizer"),
                temperature=float(data.get("temperature", 90)),
                pressure=float(data.get("pressure", 3.1)),
                rpm=float(data.get("rpm", 1500)),
                flow=float(data.get("flow", 12.5)),
                boiler=float(data.get("boiler", 35.0)),
                ph=float(data.get("ph", 6.5)),
            )
        except json.JSONDecodeError:
            # fallback for CSV or semicolon strings
            fields = dict(item.split("=") for item in line.split(";") if "=" in item)
            return SensorPayload(
                station=fields.get("station", "sterilizer"),
                temperature=float(fields.get("temp", random.uniform(85, 95))),
                pressure=float(fields.get("press", random.uniform(2.5, 3.5))),
                rpm=float(fields.get("rpm", random.uniform(1200, 1700))),
                flow=float(fields.get("flow", random.uniform(10, 20))),
                boiler=float(fields.get("boiler", random.uniform(30, 42))),
                ph=float(fields.get("ph", random.uniform(6.2, 7.0))),
            )

    def run(self) -> None:
        self.connect()
        with serial.Serial(self.port, self.baudrate, timeout=1) as ser:
            time.sleep(2)
            while True:
                payload = self.read_serial_frame(ser)
                self.publish_payload(payload)
                time.sleep(2)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="PKS MQTT Sender")
    parser.add_argument("--port", required=True, help="Serial port name, e.g. COM3 or /dev/ttyUSB0")
    parser.add_argument("--baudrate", type=int, default=9600, help="Serial baudrate")
    parser.add_argument("--topic", default="pks/telemetry", help="MQTT topic for publishing")
    args = parser.parse_args()

    sender = PKSMQTTSender(port=args.port, baudrate=args.baudrate, topic=args.topic)
    try:
        sender.run()
    except KeyboardInterrupt:
        sender.disconnect()
        print("Sender stopped by user")
