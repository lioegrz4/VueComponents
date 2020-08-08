class Result {
  constructor(ok, payload, msg) {
    this.ok = ok
    this.payload = payload
    this.msg = msg
  }
  map(fn) {
    if (this.ok) {
      this.payload = fn(this.payload)
    }
  }
  flatMap(fn) {
    if (this.ok) {
      try {
        this.payload = fn(this.payload).unwrap()
      } catch (e) {
        this.msg = e
      }
    }
  }
  unwrap() {
    if (this.ok) {
      return this.payload
    } else {
      throw Error(this.msg)
    }
  }
  state() {
    return this.ok
  }
  load({ok, payload, msg}) {
    this.ok = ok
    this.payload = payload
    this.msg = msg
  }
}

const OK = payload => {
  return new Result(true, payload, null)
}

const ERR = msg => {
  return new Result(false, null, msg)
}

module.exports = {
  OK, ERR
}
