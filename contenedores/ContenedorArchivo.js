const fs = require("fs");

class ContenedorArchivo {
    constructor(filename) {
        this.filename = filename;
        this.id = 0
      }
    
      async save(data) {
        try {
          //try to read the content
          let content = await fs.promises.readFile(this.filename, 'utf-8');
          // if the file is not empty convert it to an object and append the data
          // assing the id to the data to 1 + the last object in the array and write the file
          //return the data.id
          if(content.length > 0) {
            content = JSON.parse(content);
            content.push(data);
            data.id ++;
            data.date = new Date().toLocaleString();
            await fs.promises.writeFile(this.filename, JSON.stringify(content, null, 2));
          // if the file is empty but created, write the file with the data and
          // assign the id 
          } else if(content.length < 1) {
            await fs.promises.writeFile(this.filename, data);
            data.id = 1;
            // return data.id
          } 
          // if the file doesn't exist create it with the data within an array and return the id
        } catch (error) {
          data.id = 1;
          data.date = new Date().toLocaleString();
          await fs.promises.writeFile(this.filename, JSON.stringify([data], null, 2));
          // return data.id
        }
      }
    
    
    
      async getById(id) {
        try {
          //function to check that the id exist
          const checkId = (item) => item.id === id;
          // read and parse the content
          let content = JSON.parse(
            await fs.promises.readFile(this.filename, "utf-8")
          );
          // checking if the file is not empty and filter the desire id
          if (content.length > 0) {
            if (content.some(checkId)) {
              return content.filter((item) => item.id === id);
            } else {
              console.log(
                `El item con id: ${id} no se encuentra en el archivo ${this.filename}`
              );
              return null;
            }
          } else {
            console.log(`El archivo ${this.filename} esta vacio`);
          }
        } catch (error) {
          console.log(`Error: Archivo no encontrado o vacio ${error}`);
        }
      }
    
      async getAll() {
        try {
          //reading the file
          let content = await fs.promises.readFile(this.filename, "utf-8");
          //checking if the file is not empty and parse it
          if (content.length > 0) {
            console.log(`Obteniendo todas las entradas de: ${this.filename} ....`);
            return JSON.parse(content);
          } else {
            console.log(`El archivo ${this.filename} esta vacio`);
            return null;
          }
        } catch (error) {
          console.log(`Error: el archivo ${this.filename} no fue encontrado`);
        }
      }
      async deleteById(id) {
        try {
          // function to check that the id exist
          const checkId = (item) => item.id === id;
          //read and parse the content
          let content = JSON.parse(
            await fs.promises.readFile(this.filename, "utf-8")
          );
          //checking if the file is not empty and filter the items that
          // doesn't match the id argument and return it within the content variable
          if (content.length > 0) {
            if (content.some(checkId)) {
              console.log(`Borrando el archivo con id: ${id}`);
              content = content.filter((item) => {
                return item.id !== id;
              });
            } else {
              console.log(
                `El item con id: ${id} no se encuentra en el archivo ${this.filename}`
              );
              return null;
            }
            await fs.promises.writeFile(
              this.filename,
              JSON.stringify(content, null, 2),
              "utf8"
            );
          } else {
            console.log(`El archivo ${this.filename} esta vacio`);
            return null;
          }
        } catch (error) {
          console.log(
            `El archivo ${this.filename} no fue encontrado o esta vacio${error} `
          );
        }
      }
      async deleteAll() {
        try {
          await fs.promises.writeFile(this.filename, [], "utf-8");
        } catch (error) {
          console.log(error);
        }
      }
      
}

module.exports = ContenedorArchivo