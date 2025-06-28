const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
   return new Promise((resolve, reject) => {
      fs.readFile(file, (err, data) => {
         if (err) {
            reject("I could not find that file");
         }
         resolve(data);
      });
   });
};

const writeFilePro = (file, data) => {
   return new Promise((resolve, reject) => {
      fs.writeFile(file, data, (err) => {
         if (err) {
            reject("Could not write file");
         }
         resolve("success");
      });
   });
};

/*
// Promise chaining pattern
readFilePro(`${__dirname}/dog.txt`)
   .then((data) => {
      console.log(`Breed: ${data}`);
      return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
   })
   .then((res) => {
      console.log(res.body.message);
      return writeFilePro("dog-img.txt", res.body.message);
   })
   .then(() => {
      console.log("Random dog image saved to file!");
   })
   .catch((err) => {
      console.log(err);
   });
*/

// Async/Await (ES6)
/*
const getDogPic = async () => {
   try {
      const data = await readFilePro(`${__dirname}/dog.txt`);
      console.log(`Breed: ${data}`);

      const res = await superagent.get(
         `https://dog.ceo/api/breed/${data}/images/random`
      );
      console.log(res.body.message);

      await writeFilePro("dog-img.txt", res.body.message);
      console.log("Random dog image saved to file!");
   } catch (err) {
      console.log(err);
      throw err;
   }
   return "2: READY 🐶";
};
*/
/*
// Pattern 1: Promise to address return in Async/Await
console.log("1: Will get dog pics!");
// const x = getDogPic(); // return a promise log: Promise { <pending> }
// Solution: Want to log "2: READY 🐶" after the promise is resolved
getDogPic()
   .then((x) => {
      console.log(x);
      console.log("3: Done getting dog pics!");
   })
   .catch((err) => {
      console.log("ERROR");
   });
*/

/*
// Patern 2: IFEE - Immediately Invoked Function Expression
// Create an async function to await promise that return string
// You create a function in the paraentheses and call them right away. Don't need to declare
(async () => {
   try {
      console.log("1: Will get dog pics!");
      const x = await getDogPic();
      console.log(x);
      console.log("3: Done getting dog pics!");
   } catch (err) {
      console.log("ERROR");
   }
})();
*/

// Problem: If you want 3 pics
/*
const getDogPic = async () => {
   try {
      const data = await readFilePro(`${__dirname}/dog.txt`);
      console.log(`Breed: ${data}`);

      const res = await superagent.get(
         `https://dog.ceo/api/breed/${data}/images/random`
      );

      const res = await superagent.get(
         `https://dog.ceo/api/breed/${data}/images/random`
      );

      const res = await superagent.get(
         `https://dog.ceo/api/breed/${data}/images/random`
      );
      console.log(res.body.message);

      await writeFilePro("dog-img.txt", res.body.message);
      console.log("Random dog image saved to file!");
   } catch (err) {
      console.log(err);
      throw err;
   }
   return "2: READY 🐶";
};
*/

// Solution: Using Promise.all(arr[])
const getDogPic = async () => {
   try {
      const data = await readFilePro(`${__dirname}/dog.txt`);
      console.log(`Breed: ${data}`);

      // Not using await because you want to store a promise in a variable to call them all at once.
      const res1Prom = superagent.get(
         `https://dog.ceo/api/breed/${data}/images/random`
      );

      const res2Prom = superagent.get(
         `https://dog.ceo/api/breed/${data}/images/random`
      );

      const res3Prom = superagent.get(
         `https://dog.ceo/api/breed/${data}/images/random`
      );

      // Using Promise.all(arr[])
      const all = await Promise.all([res1Prom, res2Prom, res3Prom]);
      const imgs = all.map((el) => el.body.message);
      console.log(imgs);

      await writeFilePro("dog-img.txt", imgs.join("\n"));
      console.log("Random dog image saved to file!");
   } catch (err) {
      console.log(err);
      throw err;
   }
   return "2: READY 🐶";
};
(async () => {
   try {
      console.log("1: Will get dog pics!");
      const x = await getDogPic();
      console.log(x);
      console.log("3: Done getting dog pics!");
   } catch (err) {
      console.log("ERROR");
   }
})();
