// tests/logger.test.js

const fs = require('fs');  // This is our file helper
const path = require('path');  // This helps us work with file paths
const Logger = require('../src/utils/logger');  // This is the Logger we want to test

// We're pretending to be the 'fs' module here
jest.mock('fs');

// This is like a big game where we're testing our Logger
describe('Logger', () => {
  let logger;  // This will be our Logger that we'll test
  const testLogDir = path.join(__dirname, 'test-logs');  // This is where we'll pretend to put our logs

  // Before each small test, we set up a fresh Logger
  beforeEach(() => {
    jest.clearAllMocks();  // We clear any pretend actions we did before
    logger = new Logger(testLogDir);  // We create a new Logger for testing
  });

  // Let's check if our Logger creates a folder for logs if it doesn't exist
  it('should create log directory if it does not exist', () => {
    expect(fs.mkdirSync).toHaveBeenCalledWith(testLogDir, { recursive: true });
  });

  // Now we'll check if our Logger creates a new log file with the right name
  it('should create a new log file with timestamp in the name', () => {
    const mockWriteStream = { write: jest.fn() };  // We create a pretend write stream
    fs.createWriteStream.mockReturnValue(mockWriteStream);  // We pretend fs.createWriteStream uses our pretend stream

    logger.log('Test message');  // We tell our Logger to log a message

    // We check if the Logger tried to create a file with the right name pattern
    expect(fs.createWriteStream).toHaveBeenCalledWith(
      expect.stringMatching(/.*[\\/]test-logs[\\/]\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.log/),
      { flags: 'a' }
    );
  });

  // Let's make sure our Logger writes messages to the log file correctly
  it('should write log messages to file', () => {
    const mockWriteStream = { write: jest.fn() };  // Another pretend write stream
    fs.createWriteStream.mockReturnValue(mockWriteStream);

    logger.log('Test message');  // We log a test message

    // We check if the Logger wrote the message in the right format
    expect(mockWriteStream.write).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test message\n/)
    );
  });

  // We also want to make sure our Logger talks to the console
  it('should log messages to console', () => {
    console.log = jest.fn();  // We create a pretend console.log

    logger.log('Test message');  // We log a test message

    // We check if the Logger said the message to the console in the right format
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test message/)
    );
  });

  // Now let's check if our Logger can handle different types of messages
  it('should handle different log levels', () => {
    const mockWriteStream = { write: jest.fn() };  // Another pretend write stream
    fs.createWriteStream.mockReturnValue(mockWriteStream);
    console.log = jest.fn();  // And another pretend console.log

    // We log different types of messages
    logger.log('Info message', 'INFO');
    logger.log('Error message', 'ERROR');
    logger.log('Debug message', 'DEBUG');

    // We check if the Logger wrote and said all the messages
    expect(mockWriteStream.write).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledTimes(3);

    // We also check if each message was written with the right label
    expect(mockWriteStream.write).toHaveBeenCalledWith(expect.stringContaining('[INFO] Info message'));
    expect(mockWriteStream.write).toHaveBeenCalledWith(expect.stringContaining('[ERROR] Error message'));
    expect(mockWriteStream.write).toHaveBeenCalledWith(expect.stringContaining('[DEBUG] Debug message'));
  });

  // Finally, we want to make sure our Logger closes its book properly
  it('should close the write stream when close is called', () => {
    const mockWriteStream = { 
      write: jest.fn(),
      end: jest.fn()  // This is like the 'close book' action
    };
    fs.createWriteStream.mockReturnValue(mockWriteStream);

    logger.log('Test message');  // We write a test message
    logger.close();  // Then we close the Logger

    // We check if the Logger really closed its book
    expect(mockWriteStream.end).toHaveBeenCalled();
  });
});