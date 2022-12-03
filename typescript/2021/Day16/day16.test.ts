import { first, padStart, takeWhile } from "lodash";
import {
  add,
  equals,
  head,
  identity,
  length,
  pipe,
  reduceWhile,
  splitEvery,
  splitWhen,
  tail,
} from "ramda";
import { getInput, getExample } from "../utils/getInput";

const input = getInput(__dirname);
const example = getExample(__dirname);

const parseHexChar = (hex: string) => {
  const num = parseInt(hex);
  return !isNaN(num) ? num : hex.charCodeAt(0) - 55;
};
const asFourBits = (num: number) => padStart(num.toString(2), 4, "0");

const parseToBits = (input: string) => {
  return Array.from(input).map(parseHexChar).map(asFourBits).join("");
};

const trimEndZeroes = (bitString: string) =>
  bitString.slice(0, bitString.lastIndexOf("1") + 1);

type Packet = {
  version: number;
  type: number;
  value: number;
  operator?: any;
  subPackets?: Packet[];
};
const parsePacket = (binaryString: string): [Packet, string] => {
  const version = parseInt(binaryString.slice(0, 3), 2);
  const type = parseInt(binaryString.slice(3, 6), 2);
  const body = binaryString.slice(6);
  //0 bullshit

  if (type === 4) {
    const splitted = splitEvery(5, body);
    console.log(splitted);
    const c = splitted.slice(0, splitted.findIndex((b) => b[0] === "0") + 1);

    const bits = c.map((a) => tail(a)).join("");
    const sum = parseInt(bits, 2);

    console.log(c);
    const rest2 = body.slice(c.map(length).reduce(add));
    console.log(rest2);
    const rest3 = rest2.slice(rest2.indexOf("1"));
    return [{ version, type, value: sum }, rest3];
  } else {
    console.log(body);
    const lengthBitsAmount = body[0] === "1" ? 11 : 15;
    const packetsCountBits = body.slice(1, lengthBitsAmount + 1);
    const packetsCount = parseInt(packetsCountBits, 2);
    return packetsCount as any;

    return null;
  }
};

const part1 = (input: string) => {
  const bits = parseToBits(input);
  const packet = parsePacket(bits);
  return packet;
};

test("part1", () => {});

test("parsing", () => {
  expect(parseHexChar("0")).toEqual(0);
  expect(parseHexChar("9")).toEqual(9);
  expect(parseHexChar("A")).toEqual(10);
  expect(parseHexChar("F")).toEqual(15);

  expect(asFourBits(0)).toEqual("0000");
  expect(asFourBits(15)).toEqual("1111");
  expect(asFourBits(1)).toEqual("0001");

  expect(parseToBits("D2FE28")).toEqual("110100101111111000101000");
  expect(parseToBits("38006F45291200")).toEqual(
    "00111000000000000110111101000101001010010001001000000000"
  );
  expect(parseToBits("EE00D40C823060")).toEqual(
    "11101110000000001101010000001100100000100011000001100000"
  );

  expect(part1("8A004A801A8002F478")).toEqual(16);
  expect(part1("620080001611562C8802118E34")).toEqual(23);
  expect(part1("A0016C880162017C3686B18A3D4780")).toEqual(31);
  expect(part1(example)).toEqual(0);
  expect(part1(input)).toEqual(0);
});
