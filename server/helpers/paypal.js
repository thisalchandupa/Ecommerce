const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AYRSzRRU6n4DDRG0_y3hhiZhTMPMkLZJMCnoIruHeS0VXbE-y-g4Oj6q7uvg7hm6gpfuDphWFyd8tMdP",
  client_secret: "EF9gjQ14CBDvddX-U_VhUYOl_aRbqnTjk2As8cfbJnrR86Bb1tJtk3c3n3UxP9B1LUET8po_lUcvAeVA",
});

module.exports = paypal;
