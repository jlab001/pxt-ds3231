/*
Copyright 2018 Jack Ho, Parco Choi, Yu Sang Lo
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
let setbuf = pins.createBuffer(2)
let value = 0

enum RTCEnum {
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
    export function GetDayTime(e: RTCEnum): number {

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
    /**
     * Set the current time / date
     * @param Set the day / month / hour / minute / second 
     * 
     */
    //% blockId=settime block="Set current Hour:%h|Minute:%m|Second:%s|Day:%d|Month:%mth|Year:%yr|"
    //% weight=87
    export function SetDateTime(h: number, m: number, s: number, d: number, mth: number, yr: number): void {


        //pins.i2cWriteNumber(104, 0, NumberFormat.Int8LE)

        setbuf.setNumber(NumberFormat.Int8LE, 0, 0)
        setbuf.setNumber(NumberFormat.Int8LE, 1, decToBCD(s))
        pins.i2cWriteBuffer(104, setbuf, false)

        setbuf.setNumber(NumberFormat.Int8LE, 0, 1)
        setbuf.setNumber(NumberFormat.Int8LE, 1, decToBCD(m))
        pins.i2cWriteBuffer(104, setbuf, false)

        setbuf.setNumber(NumberFormat.Int8LE, 0, 2)
        setbuf.setNumber(NumberFormat.Int8LE, 1, decToBCD(h))
        pins.i2cWriteBuffer(104, setbuf, false)

        setbuf.setNumber(NumberFormat.Int8LE, 0, 3)
        setbuf.setNumber(NumberFormat.Int8LE, 1, decToBCD(1))
        pins.i2cWriteBuffer(104, setbuf, false)

        setbuf.setNumber(NumberFormat.Int8LE, 0, 4)
        setbuf.setNumber(NumberFormat.Int8LE, 1, decToBCD(d))
        pins.i2cWriteBuffer(104, setbuf, false)

        setbuf.setNumber(NumberFormat.Int8LE, 0, 5)
        setbuf.setNumber(NumberFormat.Int8LE, 1, decToBCD(mth))
        pins.i2cWriteBuffer(104, setbuf, false)

        setbuf.setNumber(NumberFormat.Int8LE, 0, 6)
        setbuf.setNumber(NumberFormat.Int8LE, 1, decToBCD(yr - 2000))
        pins.i2cWriteBuffer(104, setbuf, false)
    }

    /**
     * Get the current time (in string)
     * @param Get the day / month / hour / minute / second 
     * 
     */
    //% blockId=getcurrtime block="Get current time in text"
    //% weight=87
    export function GetTime(): string {

        let value = pad(DS3231.GetDayTime(RTCEnum.Hour).toString(), 2)
        value += ":"
        value += pad(DS3231.GetDayTime(RTCEnum.Minute).toString(), 2)
        value += ":"
        value += pad(DS3231.GetDayTime(RTCEnum.Second).toString(), 2)
        return value
    }

    /**
     * Get the current date in string
     * @param Get the day / month / hour / minute / second 
     * 
     */
    //% blockId=getcurrdate block="Get current date in text"
    //% weight=87
    export function GetDate(): string {

        let value = pad(DS3231.GetDayTime(RTCEnum.Day).toString(), 2)
        value += "/"
        value += pad(DS3231.GetDayTime(RTCEnum.Month).toString(), 2)
        value += "/"
        value += pad(DS3231.GetDayTime(RTCEnum.Year).toString(), 2)
        return value
    }

    /**
     * Check if the current time is as the specified time (hh:mm)
     * @param Check if the current time is as the specified time (hh:mm)
     * 
     */
    //% blockId=checkhhmm block="Is now H: %hh|,M:%mm|,S:00?"
    //% weight=87
    export function CheckTimeHHMM(hh: number, mm: number): boolean {
        if (DS3231.GetDayTime(RTCEnum.Second) == 0) {
            if ((DS3231.GetDayTime(RTCEnum.Hour) == hh) && (DS3231.GetDayTime(RTCEnum.Minute) == mm)) {
                return true
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    }

    /**
     * Check if the current time is as the specified time (mm)
     * @param Check if the current time is as the specified time (mm)
     * 
     */
    //% blockId=checkmm block="Is now M:%mm|,S:00?"
    //% weight=87
    export function CheckTimeMM(mm: number): boolean {
        if (DS3231.GetDayTime(RTCEnum.Second) == 0) {
            if (DS3231.GetDayTime(RTCEnum.Minute) == mm) {
                return true
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    }


    /**
     * Check if the current time is as the specified time (hh)
     * @param Check if the current time is as the specified time (hh)
     * 
     */
    //% blockId=checkhh block="Is now H:%hh|,M:00, S:00?"
    //% weight=87
    export function CheckTimeHH(hh: number): boolean {
        if ((DS3231.GetDayTime(RTCEnum.Minute) == 0) && (DS3231.GetDayTime(RTCEnum.Second) == 0)) {
            if (DS3231.GetDayTime(RTCEnum.Hour) == hh) {
                return true
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    }




    function decToBCD(dec: number): number {
        let tens = (dec - (dec % 10)) / 10
        let units = dec % 10
        return (tens << 4) + units
    }

    function pad(str: string, max: number): string {
        return str.length < max ? pad("0" + str, max) : str;

    }

} 
