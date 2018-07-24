const fs= require('fs');
const path = require('path');

// 扫描结果 192.168.1.1 - 192.168.10.1
let scan = []

for(let i = 1; i < 10; i++) {
  let devices = [];
  for(let j = 2; j < 30; j++) {
    devices.push({
      ip: `192.168.${i}.${j}`,
      port: Math.random() > .8 ? [] : [(Math.random() * 1000 | 0).toString(), (Math.random() * 1000 | 0).toString()],
      type: Math.random() > .5 ? 'server' : 'pc',
      os: Math.random() > .7 ? 'linux' : Math.random() > .5 ? 'winNew' : 'winOld',
      version: (Math.random() * 1000 | 0).toString(),
      remark: 'qwe',
      attacked: false
    })
  }
  scan.push({
    ip: `192.168.${i}.1`,
    devices: devices
  })
}

// 扫描结果2 192.168.1.1 - 192.168.10.1
let scan2 = []

for(let i = 100; i < 110; i++) {
  let devices = [];
  for(let j = 2; j < 500; j++) {
    devices.push({
      ip: `192.168.${i}.${j}`,
      port: Math.random() > .8 ? [] : [(Math.random() * 1000 | 0).toString(), (Math.random() * 1000 | 0).toString()],
      type: Math.random() > .5 ? 'server' : 'pc',
      os: Math.random() > .7 ? 'linux' : Math.random() > .5 ? 'winNew' : 'winOld',
      version: (Math.random() * 1000 | 0).toString(),
      remark: 'qwe',
      attacked: false
    })
  }
  scan2.push({
    ip: `192.168.${i}.1`,
    devices: devices
  })
}

// 攻击结果 192.168.1.1 - 192.168.10.1
let attack = []

for(let i = 1; i < 10; i++) {
  let devices = [];
  for(let j = 2; j < 5; j++) {
    devices.push({
      ip: `192.168.${i}.${j}`,
      port: Math.random() > .8 ? [] : [(Math.random() * 1000 | 0).toString(), (Math.random() * 1000 | 0).toString()],
      type: Math.random() > .5 ? 'server' : 'pc',
      os: Math.random() > .7 ? 'linux' : Math.random() > .5 ? 'winNew' : 'winOld',
      version: (Math.random() * 1000 | 0).toString(),
      remark: 'qwe',
      attacked: true
    })
  }
  attack.push({
    ip: `192.168.${i}.1`,
    devices: devices
  })
}


fs.writeFile(__dirname + '/test-scan.json', JSON.stringify(scan), function (err) {
  if (err) throw err;
  console.log('write scan success');
});

fs.writeFile(__dirname + '/test-scan2.json', JSON.stringify(scan2), function (err) {
  if (err) throw err;
  console.log('write scan2 success');
});

fs.writeFile(__dirname + '/test-attack.json', JSON.stringify(attack), function (err) {
  if (err) throw err;
  console.log('write attack success');
});
