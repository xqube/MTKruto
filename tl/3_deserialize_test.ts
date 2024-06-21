/**
 * MTKruto - Cross-runtime JavaScript library for building Telegram clients
 * Copyright (C) 2023-2024 Roj <https://roj.im/>
 *
 * This file is part of MTKruto.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { assertEquals } from "../0_deps.ts";
import { getType, getTypeName } from "./0_api.ts";
import { TLRawReader } from "./0_tl_raw_reader.ts";
import { deserialize } from "./2_deserialize.ts";
import { serialize } from "./2_serialize.ts";

Deno.test("deserialize", () => {
  // deno-fmt-ignore
  const buffer = new Uint8Array([
    0x1E, 0x24, 0x1A, 0xCC, 0x48, 0x0E, 0x00, 0x00, 0xE7, 0x5F,
    0x6B, 0x64, 0x9F, 0x6C, 0x6B, 0x64, 0xB5, 0x75, 0x72, 0x99,
    0x02, 0x00, 0x00, 0x00, 0x15, 0xC4, 0xB5, 0x1C, 0x09, 0x00,
    0x00, 0x00, 0x0D, 0xA1, 0xB7, 0x18, 0x04, 0x04, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x00, 0x0E, 0x32, 0x30, 0x37, 0x2E, 0x31,
    0x35, 0x34, 0x2E, 0x32, 0x34, 0x31, 0x2E, 0x37, 0x33, 0x00,
    0xCF, 0x38, 0x00, 0x00, 0x11, 0xDD, 0xFD, 0xDA, 0x25, 0x4C,
    0x78, 0xD9, 0xFA, 0x20, 0x2A, 0xC5, 0x36, 0x07, 0x9E, 0x88,
    0xB8, 0x08, 0x00, 0x00, 0x0D, 0xA1, 0xB7, 0x18, 0x10, 0x00,
    0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x0E, 0x31, 0x34, 0x39,
    0x2E, 0x31, 0x35, 0x34, 0x2E, 0x31, 0x37, 0x35, 0x2E, 0x31,
    0x30, 0x00, 0x50, 0x00, 0x00, 0x00, 0x0D, 0xA1, 0xB7, 0x18,
    0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x27, 0x32,
    0x30, 0x30, 0x31, 0x3A, 0x30, 0x62, 0x32, 0x38, 0x3A, 0x66,
    0x32, 0x33, 0x64, 0x3A, 0x66, 0x30, 0x30, 0x31, 0x3A, 0x30,
    0x30, 0x30, 0x30, 0x3A, 0x30, 0x30, 0x30, 0x30, 0x3A, 0x30,
    0x30, 0x30, 0x30, 0x3A, 0x30, 0x30, 0x30, 0x65, 0xBB, 0x01,
    0x00, 0x00, 0x0D, 0xA1, 0xB7, 0x18, 0x10, 0x00, 0x00, 0x00,
    0x02, 0x00, 0x00, 0x00, 0x0E, 0x31, 0x34, 0x39, 0x2E, 0x31,
    0x35, 0x34, 0x2E, 0x31, 0x36, 0x37, 0x2E, 0x34, 0x30, 0x00,
    0xBB, 0x01, 0x00, 0x00, 0x0D, 0xA1, 0xB7, 0x18, 0x04, 0x04,
    0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x0E, 0x32, 0x30, 0x37,
    0x2E, 0x31, 0x35, 0x34, 0x2E, 0x32, 0x34, 0x31, 0x2E, 0x37,
    0x33, 0x00, 0xCF, 0x38, 0x00, 0x00, 0x11, 0xDD, 0xFD, 0xDA,
    0x25, 0x4C, 0x78, 0xD9, 0xFA, 0x20, 0x2A, 0xC5, 0x36, 0x07,
    0x9E, 0x88, 0xB8, 0x08, 0x00, 0x00, 0x0D, 0xA1, 0xB7, 0x18,
    0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x27, 0x32,
    0x30, 0x30, 0x31, 0x3A, 0x30, 0x36, 0x37, 0x63, 0x3A, 0x30,
    0x34, 0x65, 0x38, 0x3A, 0x66, 0x30, 0x30, 0x32, 0x3A, 0x30,
    0x30, 0x30, 0x30, 0x3A, 0x30, 0x30, 0x30, 0x30, 0x3A, 0x30,
    0x30, 0x30, 0x30, 0x3A, 0x30, 0x30, 0x30, 0x65, 0xBB, 0x01,
    0x00, 0x00, 0x0D, 0xA1, 0xB7, 0x18, 0x10, 0x00, 0x00, 0x00,
    0x03, 0x00, 0x00, 0x00, 0x0F, 0x31, 0x34, 0x39, 0x2E, 0x31,
    0x35, 0x34, 0x2E, 0x31, 0x37, 0x35, 0x2E, 0x31, 0x31, 0x37,
    0xBB, 0x01, 0x00, 0x00, 0x0D, 0xA1, 0xB7, 0x18, 0x04, 0x04,
    0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x0E, 0x32, 0x30, 0x37,
    0x2E, 0x31, 0x35, 0x34, 0x2E, 0x32, 0x34, 0x31, 0x2E, 0x37,
    0x33, 0x00, 0xCF, 0x38, 0x00, 0x00, 0x11, 0xDD, 0xFD, 0xDA,
    0x25, 0x4C, 0x78, 0xD9, 0xFA, 0x20, 0x2A, 0xC5, 0x36, 0x07,
    0x9E, 0x88, 0xB8, 0x08, 0x00, 0x00, 0x0D, 0xA1, 0xB7, 0x18,
    0x01, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x27, 0x32,
    0x30, 0x30, 0x31, 0x3A, 0x30, 0x62, 0x32, 0x38, 0x3A, 0x66,
    0x32, 0x33, 0x64, 0x3A, 0x66, 0x30, 0x30, 0x33, 0x3A, 0x30,
    0x30, 0x30, 0x30, 0x3A, 0x30, 0x30, 0x30, 0x30, 0x3A, 0x30,
    0x30, 0x30, 0x30, 0x3A, 0x30, 0x30, 0x30, 0x65, 0xBB, 0x01,
    0x00, 0x00, 0x0E, 0x74, 0x61, 0x70, 0x76, 0x33, 0x2E, 0x73,
    0x74, 0x65, 0x6C, 0x2E, 0x63, 0x6F, 0x6D, 0x00, 0x32, 0x00,
    0x00, 0x00, 0xF4, 0x01, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00,
    0x50, 0x34, 0x03, 0x00, 0x88, 0x13, 0x00, 0x00, 0x30, 0x75,
    0x00, 0x00, 0xE0, 0x93, 0x04, 0x00, 0x30, 0x75, 0x00, 0x00,
    0xDC, 0x05, 0x00, 0x00, 0x60, 0xEA, 0x00, 0x00, 0x02, 0x00,
    0x00, 0x00, 0x84, 0x03, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x7F,
    0xFF, 0xFF, 0xFF, 0x7F, 0x00, 0xEA, 0x24, 0x00, 0xC8, 0x00,
    0x00, 0x00, 0x2C, 0x01, 0x00, 0x00, 0x20, 0x4E, 0x00, 0x00,
    0x90, 0x5F, 0x01, 0x00, 0x30, 0x75, 0x00, 0x00, 0x10, 0x27,
    0x00, 0x00, 0x0D, 0x68, 0x74, 0x74, 0x70, 0x73, 0x3A, 0x2F,
    0x2F, 0x74, 0x2E, 0x6D, 0x65, 0x2F, 0x00, 0x00, 0x0A, 0x63,
    0x6F, 0x6E, 0x74, 0x65, 0x78, 0x74, 0x62, 0x6F, 0x74, 0x00,
    0x0D, 0x66, 0x6F, 0x75, 0x72, 0x73, 0x71, 0x75, 0x61, 0x72,
    0x65, 0x62, 0x6F, 0x74, 0x00, 0x00, 0x08, 0x69, 0x6D, 0x61,
    0x67, 0x65, 0x62, 0x6F, 0x74, 0x00, 0x00, 0x00, 0x00, 0x04,
    0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00
  ]);
  const reader = new TLRawReader(buffer);

  const constructorId = reader.readInt32(false);
  const constructor = getTypeName(constructorId)!;

  const config = deserialize(reader, getType(constructor)![1], constructor);

  assertEquals(serialize(config), buffer);
  assertEquals(config._, "config");
});
