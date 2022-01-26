import {hash, compare} from 'bcrypt'

const saltRounds = 10;

export function encryptPwd(password:string):string {
  const hashPwd = hash(password, saltRounds);
  return hashPwd;
}

export function comparePwd(password:string, hashPwd:string) {
  return compare(password, hashPwd);
}

export function generatePwd ():string{
   return Math.random().toString(36).slice(2)
}

export const defaulPwd = "123456Az"

// module.exports.encryptPwd = encryptPwd;
// module.exports.comparePwd = comparePwd;
