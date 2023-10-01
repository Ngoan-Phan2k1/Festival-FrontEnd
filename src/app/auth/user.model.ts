export class User {
    constructor(

      private _token: string,
      private _tokenExpirationDate: Date,
      public email: string,
      public touristId: number,
      public username: string,
      public fullname: string,  
      
    ) {}
  
    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }
}