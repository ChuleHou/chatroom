export function validEmail(val) {
  return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val);
}

export function validPhone(val) {
  return /^1[3456789]\d{9}$/.test(val);
}

export function validPass(val) {
  return true;// /^[a-zA-Z\d]{8,20}$/.test(val);
  // return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(val);
  // return /^.{6,16}$/.test(val);
}

export function validNumber(val) {
  return /^[0-9]*$/.test(val);
}


export function validUserName(name) {
  return validEmail(name) ;
}

export function validCode(val) {
  return /^[0-9]{6}$/.test(val);
}

export function userName(str) {
  const re = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  return re.test(str);
}

export function validateMainName2(name) {
  const re = /^[a-zA-Z0-9_-]{1,19}$/
  return re.test(name);
}

export function validateNickName(name) {
  const re = /^[a-zA-Z0-9\u4E00-\u9FA5]{2,10}$/
  return re.test(name);
}





export default {
  validEmail,
  validPhone,
  validUserName,
  validCode,
  validPass,
  userName,
  validateMainName2,
  validateNickName
}
