/*
Copyright 2018 Jack Ho, Parco Choi, Sang Lo (MCEHK)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

let ss = 0
let mm = 0
let hh = 0
let dd = 0
let mth = 0
let yyyy = 0
let buf = pins.createBuffer(7)
let value = 0

enum MyEnum {
    //% block="Second"
    Second,
    //% block="Minute"
    Minute,
    //% block="Hour"
    Hour,
    //% block="Day"
    Day,
    //% block="Month"
    Month,
    //% block="Year"
    Year
}

//% color="#31C7D5" weight=10 icon="\uf192"
namespace DS3231 {
    /**
     * Get the current time / date
     * @param Get the day / month / hour / minute / second 
     * 
     */
    //% blockId=realtimeclock block="Get|current %e"
    //% weight=87
    export function GetDayTime(e: MyEnum): number {

        if (e == 0) {
            pins.i2cWriteNumber(
                104,
                0,
                NumberFormat.UInt8LE,
                false
            )
            buf = pins.i2cReadBuffer(0x68, 7, false)
            ss = buf.getNumber(NumberFormat.UInt8LE, 0)
            value = ((ss & 0xf0) >> 4) * 10 + (ss & 0x0f)
        }
        if (e == 1) {
            pins.i2cWriteNumber(
                104,
                0,
                NumberFormat.UInt8LE,
                false
            )
            buf = pins.i2cReadBuffer(0x68, 7, false)
            mm = buf.getNumber(NumberFormat.UInt8LE, 1)
            value = ((mm & 0xf0) >> 4) * 10 + (mm & 0x0f)
        }
        if (e == 2) {
            pins.i2cWriteNumber(
                104,
                0,
                NumberFormat.UInt8LE,
                false
            )
            buf = pins.i2cReadBuffer(0x68, 7, false)
            hh = buf.getNumber(NumberFormat.UInt8LE, 2)
            if (hh & 0x40) {
                value = (((hh & 0x1f) & 0xf0) >> 4) * 10 + ((hh & 0x1f) & 0x0f)
                if (hh & 0x20)
                { value = value + 12 }
            }
            else
            { value = ((hh & 0xf0) >> 4) * 10 + (hh & 0x0f) }
        }

        if (e == 3) {
            pins.i2cWriteNumber(
                104,
                0,
                NumberFormat.UInt8LE,
                false
            )
            buf = pins.i2cReadBuffer(0x68, 7, false)
            dd = buf.getNumber(NumberFormat.UInt8LE, 4)
            value = ((dd & 0xf0) >> 4) * 10 + (dd & 0x0f)
        }

        if (e == 4) {
            pins.i2cWriteNumber(
                104,
                0,
                NumberFormat.UInt8LE,
                false
            )
            buf = pins.i2cReadBuffer(0x68, 7, false)
            mth = buf.getNumber(NumberFormat.UInt8LE, 5)
            value = (((mth & 0x1f) & 0xf0) >> 4) * 10 + ((mth & 0x1f) & 0x0f)
        }

        if (e == 5) {
            pins.i2cWriteNumber(
                104,
                0,
                NumberFormat.UInt8LE,
                false
            )
            buf = pins.i2cReadBuffer(0x68, 7, false)
            yyyy = buf.getNumber(NumberFormat.UInt8LE, 6)
            value = ((yyyy & 0xf0) >> 4) * 10 + (yyyy & 0x0f) + 2000
        }

        return value
    }
}
