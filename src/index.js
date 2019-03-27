var http = require("http");

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Dobrý den.");
});

app.get("/crypto", (req, res) => {
  let types = new Set();
  let currencies = new Set();
  request(
    "https://apiv2.bitcoinaverage.com/symbols/indices/ticker",
    (error, repsonse, body) => {
      let data = JSON.parse(body);
      data.global.symbols.forEach(e => {
        types.add(e.substring(0, 3));
        currencies.add(e.substring(3, 6));
      });
      let formular = "<form action='/crypto' method='post'>";
      formular += "<input type='number' name='value' placeholder='Value'/>";
      formular += "<select name= 'crypto'>";
      types.forEach(em => {
        formular += "<option value='" + em + "'>" + em + "</option>";
      });
      formular += "</select>";
      formular += "<select name= 'flat'>";
      currencies.forEach(em => {
        formular += "<option value='" + em + "'>" + em + "</option>";
      });
      formular += "</select>";
      formular += "<button type='submit' name='submit'>Fesh</button>";
      res.send(formular);
    }
  );
});

app.post("/crypto", (req, res) => {
  let crypto = req.body.crypto;
  let flat = req.body.flat;
  let value = req.body.value;
  let options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global?from=",
    method: "GET",
    qs: {
      from: crypto,
      to: flat,
      amount: value
    }
  };

  request(options, (error, repsonse, body) => {
    let data = JSON.parse(body);
    res.send(
      "<h1>Aktualni cena za " +
        value +
        " " +
        crypto +
        " je " +
        data.price +
        " " +
        flat +
        "</h1>"
    );
  });
});

app.get("/calc", (req, res) => {
  let formular = "<form action='/calc' method='post'>";
  formular += "<input type='text' name='num1' placeholder='První číslo'/>";
  formular += "<input type='text' name='num2' placeholder='Druhé číslo'/>";
  formular += "<button type='submit' name='submit'>Budiž</button>";
  formular += "</form>";
  res.send(formular);
});
app.post("/calc", (req, res) => {
  let num1 = Number(req.body.num1);
  let num2 = Number(req.body.num2);
  let result = num1 + num2;
  res.send("Součet je: " + result);
});
let f = ", ";
//PRO n=1 pise 0! originalni fibbonacci ma 0 pro n=0.
//=> Je to posunute o jedna, ale jednoduse se to da zmenit,bude li potreba
app.get("/fibo/:n", (req, res) => {
  let n = Number(req.params.n);
  ab(0, 1, n - 3);

  f += "1 I 0";
  f = f
    .split("I")
    .reverse()
    .join("");
  if (n > 2) {
    res.send(f);
  } else if (n === 1) {
    res.send("0");
  } else if (n === 2) {
    res.send("0 1");
  }
  f = "";
});
function ab(x, y, n) {
  if (n > 0) {
    ab(y, x + y, n - 1);
  }
  console.log(x + y);
  f += x + y + " I ";
}
//create a server object:
app.listen(8080, () => {
  console.log("Server běží na portu 8080");
});
