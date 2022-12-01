import { Errors } from "../errors";

export class UserAlreadyExist extends Errors {
  constructor() {
    super(400, "User already exist");
  }
}

export class UserNotFound extends Errors {
  constructor() {
    super(404, "User not found");
  }
}

export class UserPasswordDoNotMatch extends Errors {
  constructor() {
    super(400, "Password do not match");
  }
}

export class WrongPasswordOrLogin extends Errors {
  constructor() {
    super(400, "Wrong password or login ");
  }
}