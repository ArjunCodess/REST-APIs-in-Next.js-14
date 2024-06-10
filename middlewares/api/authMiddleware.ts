const validate = (token: any) => {
     const validToken = true;

     if (!validToken || !token) {
          return false;
     }

     return true;
}