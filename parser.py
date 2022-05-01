#!/usr/bin/env python3
from __future__ import annotations

import datetime as dt
import itertools
import json
import re
import sys
from dataclasses import dataclass, fields, asdict
from typing import Iterable, TextIO


PREMABLE_PATTERN = re.compile(
    r"^(?P<month>\d\d?)/(?P<day>\d\d?)/(?P<year>\d\d), (?P<hour>\d\d):(?P<minute>\d\d) - (?P<author>[^:]+)((: )|$)",
    re.MULTILINE | re.UNICODE,
)
PHONE_NUMBER = re.compile(r'\+?972[\d-]+')


@dataclass
class MessageMetadata:
    month: str
    day: str
    year: str
    hour: str
    minute: str
    author: str


@dataclass
class Message:
    meta: MessageMetadata
    text: str


def split_messages(text: str) -> Iterable[Message]:
    matches = PREMABLE_PATTERN.finditer(text)
    prev = next(matches, None)
    if not prev:
        # no matches
        return
    for match in itertools.chain(matches, [None]):
        yield Message(
            MessageMetadata(**prev.groupdict()),
            text[prev.end() : match.start() if match else None],
        )
        if match:
            prev = match


@dataclass
class ArrivalReport:
    date: dt.date
    time: dt.time
    resturaunts: str


NOT_AN_ARRIVAL_REPORT_DENY_LIST = [
    "?",  # question mark implies someone asking about their food
    "deleted",
    "added",
    "left",
    "encrypted",
    "omitted",
]


def is_not_an_arrival_report(message: Message) -> bool:
    return any(phrase in message.text for phrase in NOT_AN_ARRIVAL_REPORT_DENY_LIST)


VALID_REPORT_CHARACTERS = frozenset(
    "abcdefghijklmnopqrstuvwxyz0123456789 -_אבגדהוזחטיכלמנסעפצקרשתךםןףץ\n"
)


def sanitize_message_text(text: str) -> str:
    text = text.replace(",", "\n").lower()
    text = PHONE_NUMBER.sub('redacted-phone', text)
    return "".join(c for c in text if c in VALID_REPORT_CHARACTERS).strip()


def parse_message(message: Message) -> list[ArrivalReport]:
    if is_not_an_arrival_report(message):
        return []
    meta = message.meta
    reported = dt.datetime(
        *map(int, ("20" + meta.year, meta.month, meta.day, meta.hour, meta.minute, 0))
    )
    text = sanitize_message_text(message.text)
    if not text:
        return []
    return [ArrivalReport(date=reported.date(), time=reported.time(), resturaunts=text)]


def write_reports_to_json(f: TextIO, reports: Iterable[ArrivalReport]) -> None:
    json.dump(
        [
            {
                "date": str(r.date),
                "time": str(r.time),
                "resturaunts": r.resturaunts,
            }
            for r in reports
        ],
        f,
    )


def main():
    text = sys.stdin.read()
    messages = split_messages(text)
    reports = itertools.chain.from_iterable(map(parse_message, messages))
    write_reports_to_json(sys.stdout, reports)


if __name__ == "__main__":
    main()
