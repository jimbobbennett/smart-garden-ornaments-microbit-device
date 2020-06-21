function Get_message_device_id (message: string) {
    return parseFloat(message.split(":")[0])
}
function Send_message (Type: string, value: number) {
    basic.showIcon(IconNames.Duck)
    message_to_send = "" + device_id + ":" + Type + ":" + ("" + value)
    radio.sendString(message_to_send)
    basic.clearScreen()
}
function Check_last_message_time (received_device_id: number) {
    for (let received_message of received_messages) {
        if (Get_message_device_id(received_message) == received_device_id) {
            message_received_time = Get_message_received_time(received_message)
            time_since_message = input.runningTime() - message_received_time
            if (time_since_message < 540000) {
                return 0
            } else {
                received_messages.removeAt(received_messages.indexOf(received_message))
                return 1
            }
        }
    }
    return 1
}
radio.onReceivedString(function (receivedString) {
    basic.showIcon(IconNames.SmallDiamond)
    received_message_device_id = Get_message_device_id(receivedString)
    if (device_id != received_message_device_id) {
        if (Check_last_message_time(received_message_device_id) == 1) {
            basic.showIcon(IconNames.Yes)
            received_messages.push("" + received_message_device_id + ":" + input.runningTime())
            radio.sendString(receivedString)
        }
        basic.showIcon(IconNames.No)
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.clearScreen()
})
function Get_message_received_time (message: string) {
    return parseFloat(message.split(":")[1])
}
let received_message_device_id = 0
let time_since_message = 0
let message_received_time = 0
let message_to_send = ""
let received_messages: string[] = []
let device_id = 0
radio.setGroup(1)
radio.setTransmitPower(7)
device_id = 4
received_messages = []
basic.forever(function () {
    Send_message("t", input.temperature())
    basic.pause(600000)
})
