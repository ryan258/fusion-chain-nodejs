// src/utils/logger.js

const fs = require('fs');  // This is like bringing in a helper to read and write files
const path = require('path');  // This helper helps us work with file and folder paths

/**
 * Hey there! 👋 This is our Logger class. It's like a diary for our program,
 * writing down everything important that happens!
 */
class Logger {
  /**
   * This is where we set up our logger, giving it a special place to keep its diary.
   * 
   * @param {string} logDir - This is the folder where we'll keep our log files.
   */
  constructor(logDir) {
    this.logDir = logDir;  // We remember where to put our diary
    this.writeStream = null;  // This is like our pen, we'll set it up later
    this.ensureLogDirectory();  // We make sure we have a place to put our diary
  }

  /**
   * This method makes sure we have a folder to store our log files.
   * It's like making sure we have a bookshelf before we start collecting books! 📚
   */
  ensureLogDirectory() {
    // If the diary folder doesn't exist...
    if (!fs.existsSync(this.logDir)) {
      // ...we create it!
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * This method starts a new log file, like opening a fresh page in our diary.
   */
  startNewLog() {
    // We create a special name for our diary page using the current date and time
    const now = new Date();
    const timestamp = now.toISOString().split('.')[0].replace(/:/g, '-');
    const logFile = path.join(this.logDir, `${timestamp}.log`);
    // We get our pen ready to write in the new diary page
    this.writeStream = fs.createWriteStream(logFile, { flags: 'a' });
  }

  /**
   * This is how we write messages in our diary (log file) and also tell them to the console.
   * 
   * @param {string} message - This is what we want to write down.
   * @param {string} [type='INFO'] - This tells us how important the message is.
   */
  log(message, type = 'INFO') {
    // If we haven't started writing yet, we open a new page
    if (!this.writeStream) {
      this.startNewLog();
    }

    // We prepare what we want to write, including the time and how important it is
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${type}] ${message}\n`;
    
    // We write it in our diary
    this.writeStream.write(logEntry);
    // We also say it out loud (to the console)
    console.log(logEntry.trim());
  }

  /**
   * This method closes our diary when we're done writing.
   * It's like putting the book back on the shelf! 📕
   */
  close() {
    // If we have been writing, we close the book
    if (this.writeStream) {
      this.writeStream.end();
    }
  }
}

// We're making our Logger available for others to use.
// It's like sharing our diary-writing skills with friends!
module.exports = Logger;