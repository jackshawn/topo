/**
 * 合并多个扫描与攻击结果
 * @param  {array}  arr1  原结果数组
 * @param  {array}  arr2  新结果数组
 * @return {array}
 */

const arrConcat = (arr1, arr2) => {
  // 遍历arr2
  arr2.forEach(arr2item => {
    // 标识是否添加
    let toadd = true;
    // 遍历arr1
    arr1.forEach(arr1item => {
      // 如果arr1中存在与arr2相同的网段
      if(arr1item.ip === arr2item.ip) {
        // 不添加网段
        toadd = false;

        // arr1当前网段没有的设备
        let arr3 = []
        // 遍历arr2中设备
        arr2item.devices.forEach(arr2itemDevice => {

          // 标识是否添加
          let toadd1 = true;
          arr1item.devices.forEach(arr1itemDevice => {
            // 如果设备IP相同则直接更新
            if(arr1itemDevice.ip === arr2itemDevice.ip) {
              toadd1 = false;
              arr1itemDevice.port = arr2itemDevice.port;
              arr1itemDevice.type = arr2itemDevice.type;
              arr1itemDevice.os = arr2itemDevice.os;
              arr1itemDevice.version = arr2itemDevice.version;
              arr1itemDevice.attacked = arr2itemDevice.attacked;
              arr1itemDevice.remark = arr2itemDevice.remark;
            }
          })

          if(toadd1) {
            arr3.push(arr2itemDevice)
          }
        })

        arr1item.devices = arr1item.devices.concat(arr3);
      }
    })
    if(toadd) {
      arr1.push(arr2item)
    }
  })
}

module.exports =  arrConcat
