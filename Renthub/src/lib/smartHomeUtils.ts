import { SmartDevice, SmartDeviceType, SmartDeviceActivity, SmartHomeEnergyData, SmartHomeSecurityEvent } from './types'

export const deviceIcons: Record<SmartDeviceType, string> = {
  thermostat: '🌡️',
  light: '💡',
  lock: '🔒',
  camera: '📷',
  doorbell: '🔔',
  alarm: '🚨',
  blinds: '🪟',
  plug: '🔌',
  speaker: '🔊',
  sensor: '📡',
  'air-quality': '💨',
  garage: '🚪',
  appliance: '🏠'
}

export const deviceTypeNames: Record<SmartDeviceType, string> = {
  thermostat: 'Thermostat',
  light: 'Smart Light',
  lock: 'Smart Lock',
  camera: 'Security Camera',
  doorbell: 'Video Doorbell',
  alarm: 'Alarm System',
  blinds: 'Smart Blinds',
  plug: 'Smart Plug',
  speaker: 'Smart Speaker',
  sensor: 'Sensor',
  'air-quality': 'Air Quality Monitor',
  garage: 'Garage Door',
  appliance: 'Smart Appliance'
}

export const deviceBrands = [
  'Nest',
  'Ring',
  'Philips Hue',
  'August',
  'Ecobee',
  'TP-Link',
  'Aqara',
  'Yale',
  'Wyze',
  'Eufy',
  'Sonos',
  'Amazon',
  'Google',
  'Samsung SmartThings',
  'LIFX',
  'Schlage'
]

export function generateSampleDevices(propertyId: string): SmartDevice[] {
  const devices: SmartDevice[] = []
  const now = Date.now()

  devices.push({
    id: `device-${propertyId}-1`,
    propertyId,
    name: 'Living Room Thermostat',
    type: 'thermostat',
    brand: 'Nest',
    model: 'Learning Thermostat 3rd Gen',
    location: 'Living Room',
    status: 'online',
    battery: 95,
    firmwareVersion: '5.9.3',
    lastUpdated: now,
    installedAt: now - 30 * 24 * 60 * 60 * 1000,
    capabilities: {
      temperature: true,
      humidity: true,
      scheduling: true,
      energyMonitoring: true
    },
    state: {
      power: true,
      temperature: 22,
      targetTemperature: 21,
      humidity: 45,
      mode: 'heat',
      schedule: true
    },
    settings: {
      scheduleEnabled: true
    }
  })

  devices.push({
    id: `device-${propertyId}-2`,
    propertyId,
    name: 'Front Door Lock',
    type: 'lock',
    brand: 'August',
    model: 'Smart Lock Pro',
    location: 'Front Door',
    status: 'online',
    battery: 78,
    firmwareVersion: '2.4.1',
    lastUpdated: now,
    installedAt: now - 60 * 24 * 60 * 60 * 1000,
    capabilities: {
      lock: true,
      scheduling: true
    },
    state: {
      locked: true,
      power: true
    },
    settings: {
      autoLock: true,
      autoLockDelay: 30,
      notifications: true
    }
  })

  devices.push({
    id: `device-${propertyId}-3`,
    propertyId,
    name: 'Living Room Lights',
    type: 'light',
    brand: 'Philips Hue',
    model: 'Color Bulb A19',
    location: 'Living Room',
    status: 'online',
    firmwareVersion: '1.88.1',
    lastUpdated: now,
    installedAt: now - 90 * 24 * 60 * 60 * 1000,
    capabilities: {
      onOff: true,
      dimming: true,
      colorControl: true,
      scheduling: true
    },
    state: {
      power: true,
      brightness: 80,
      color: '#FFD700'
    }
  })

  devices.push({
    id: `device-${propertyId}-4`,
    propertyId,
    name: 'Front Door Camera',
    type: 'camera',
    brand: 'Ring',
    model: 'Stick Up Cam',
    location: 'Front Entrance',
    status: 'online',
    firmwareVersion: '1.0.25',
    lastUpdated: now,
    installedAt: now - 45 * 24 * 60 * 60 * 1000,
    capabilities: {
      camera: true,
      motion: true
    },
    state: {
      power: true
    },
    settings: {
      motionSensitivity: 'medium',
      nightMode: true,
      notifications: true
    }
  })

  devices.push({
    id: `device-${propertyId}-5`,
    propertyId,
    name: 'Bedroom Lights',
    type: 'light',
    brand: 'Philips Hue',
    model: 'White Ambiance',
    location: 'Master Bedroom',
    status: 'online',
    firmwareVersion: '1.88.1',
    lastUpdated: now,
    installedAt: now - 90 * 24 * 60 * 60 * 1000,
    capabilities: {
      onOff: true,
      dimming: true,
      scheduling: true
    },
    state: {
      power: false,
      brightness: 60
    }
  })

  devices.push({
    id: `device-${propertyId}-6`,
    propertyId,
    name: 'Coffee Maker',
    type: 'plug',
    brand: 'TP-Link',
    model: 'Kasa Smart Plug',
    location: 'Kitchen',
    status: 'online',
    firmwareVersion: '1.0.11',
    lastUpdated: now,
    installedAt: now - 20 * 24 * 60 * 60 * 1000,
    capabilities: {
      onOff: true,
      scheduling: true,
      energyMonitoring: true
    },
    state: {
      power: false,
      energyUsage: 0.5
    }
  })

  return devices
}

export function toggleDevice(device: SmartDevice): SmartDevice {
  return {
    ...device,
    state: {
      ...device.state,
      power: !device.state.power
    },
    lastUpdated: Date.now()
  }
}

export function setDeviceBrightness(device: SmartDevice, brightness: number): SmartDevice {
  return {
    ...device,
    state: {
      ...device.state,
      brightness: Math.max(0, Math.min(100, brightness))
    },
    lastUpdated: Date.now()
  }
}

export function setDeviceTemperature(device: SmartDevice, temperature: number): SmartDevice {
  return {
    ...device,
    state: {
      ...device.state,
      targetTemperature: temperature
    },
    lastUpdated: Date.now()
  }
}

export function lockDevice(device: SmartDevice, locked: boolean): SmartDevice {
  return {
    ...device,
    state: {
      ...device.state,
      locked
    },
    lastUpdated: Date.now()
  }
}

export function setDeviceColor(device: SmartDevice, color: string): SmartDevice {
  return {
    ...device,
    state: {
      ...device.state,
      color
    },
    lastUpdated: Date.now()
  }
}

export function createActivity(
  device: SmartDevice,
  action: string,
  previousState: any,
  newState: any,
  userId?: string,
  userName?: string
): SmartDeviceActivity {
  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    deviceId: device.id,
    deviceName: device.name,
    propertyId: device.propertyId,
    action,
    previousState,
    newState,
    triggeredBy: userId ? 'user' : 'system',
    userId,
    userName,
    timestamp: Date.now(),
    location: device.location
  }
}

export function generateEnergyData(propertyId: string, days: number = 30): SmartHomeEnergyData[] {
  const data: SmartHomeEnergyData[] = []
  const now = Date.now()

  for (let i = days - 1; i >= 0; i--) {
    const date = now - i * 24 * 60 * 60 * 1000
    const baseConsumption = 15 + Math.random() * 10
    
    data.push({
      propertyId,
      date,
      consumption: baseConsumption,
      cost: baseConsumption * 0.15,
      breakdown: {
        heating: baseConsumption * 0.35,
        cooling: baseConsumption * 0.20,
        lighting: baseConsumption * 0.15,
        appliances: baseConsumption * 0.25,
        other: baseConsumption * 0.05
      }
    })
  }

  return data
}

export function getDevicesByType(devices: SmartDevice[], type: SmartDeviceType): SmartDevice[] {
  return devices.filter(d => d.type === type)
}

export function getDevicesByLocation(devices: SmartDevice[], location: string): SmartDevice[] {
  return devices.filter(d => d.location === location)
}

export function getOnlineDevices(devices: SmartDevice[]): SmartDevice[] {
  return devices.filter(d => d.status === 'online')
}

export function getOfflineDevices(devices: SmartDevice[]): SmartDevice[] {
  return devices.filter(d => d.status === 'offline')
}

export function getLowBatteryDevices(devices: SmartDevice[], threshold: number = 20): SmartDevice[] {
  return devices.filter(d => d.battery !== undefined && d.battery < threshold)
}

export function getUniqueLocations(devices: SmartDevice[]): string[] {
  return Array.from(new Set(devices.map(d => d.location))).sort()
}

export function calculateEnergySavings(data: SmartHomeEnergyData[]): number {
  if (data.length < 2) return 0
  
  const recent = data.slice(-7).reduce((sum, d) => sum + d.consumption, 0) / 7
  const previous = data.slice(-14, -7).reduce((sum, d) => sum + d.consumption, 0) / 7
  
  return ((previous - recent) / previous) * 100
}

export function generateSecurityEvent(
  propertyId: string,
  deviceId: string,
  deviceName: string,
  type: SmartHomeSecurityEvent['type'],
  severity: SmartHomeSecurityEvent['severity'] = 'info'
): SmartHomeSecurityEvent {
  const messages: Record<SmartHomeSecurityEvent['type'], string> = {
    'motion': 'Motion detected',
    'door-open': 'Door opened',
    'door-closed': 'Door closed',
    'lock': 'Door locked',
    'unlock': 'Door unlocked',
    'alarm': 'Alarm triggered',
    'camera-triggered': 'Camera motion detected',
    'window-open': 'Window opened'
  }

  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId,
    deviceId,
    deviceName,
    type,
    severity,
    message: messages[type],
    timestamp: Date.now(),
    resolved: false
  }
}

export async function simulateDeviceControl(device: SmartDevice, action: string, value?: any): Promise<SmartDevice> {
  await new Promise(resolve => setTimeout(resolve, 500))

  let updatedDevice = { ...device }

  switch (action) {
    case 'toggle':
      updatedDevice = toggleDevice(device)
      break
    case 'setBrightness':
      if (typeof value === 'number') {
        updatedDevice = setDeviceBrightness(device, value)
      }
      break
    case 'setTemperature':
      if (typeof value === 'number') {
        updatedDevice = setDeviceTemperature(device, value)
      }
      break
    case 'lock':
      updatedDevice = lockDevice(device, true)
      break
    case 'unlock':
      updatedDevice = lockDevice(device, false)
      break
    case 'setColor':
      if (typeof value === 'string') {
        updatedDevice = setDeviceColor(device, value)
      }
      break
    default:
      break
  }

  return updatedDevice
}

export function canUserControlDevice(
  device: SmartDevice,
  userId: string,
  isLandlord: boolean,
  settings?: any
): boolean {
  if (isLandlord) return true
  
  if (settings?.tenantControlEnabled) {
    if (settings.tenantRestrictedDevices?.includes(device.id)) {
      return false
    }
    if (settings.tenantControlDevices?.includes(device.id)) {
      return true
    }
  }
  
  return false
}
