import { NativeEventEmitter, NativeModules } from 'react-native'
import { BaseBLE, StartOptions } from './base'
import { write, startCentral, scan, connect } from './functions'

export class Central extends BaseBLE {
  async sendMessage(message: string) {
    await write(message)
  }

  async start(options: StartOptions) {
    await startCentral(options)
  }

  async shutdown() {
    // TODO: Implement native
    throw new Error('Not implemented')
  }

  registerMessageListener(cb: (msg: string) => void) {
    const bleDidcommEmitter = new NativeEventEmitter(NativeModules.BleDidcomm)
    const onReceivedNotificationListener = bleDidcommEmitter.addListener(
      'onReceivedNotification',
      cb
    )

    return onReceivedNotificationListener
  }

  async scan() {
    await scan()
  }

  async connect(peripheralId: string) {
    await connect(peripheralId)
  }

  registerOnScannedListener(
    cb: ({
      peripheralId: pId,
      name,
    }: {
      peripheralId: string
      name?: string
    }) => void
  ) {
    const bleDidcommEmitter = new NativeEventEmitter(NativeModules.BleDidcomm)
    const onDiscoverPeripheralListener = bleDidcommEmitter.addListener(
      'onDiscoverPeripheral',
      ({
        peripheralId: pId,
        name,
      }: {
        peripheralId: string
        name?: string
      }) => {
        cb({ peripheralId: pId, name })
      }
    )
    return onDiscoverPeripheralListener
  }
}
