class Log {
    constructor() {
        this.logs = [];
    }
  
    addLog(log) {
      this.logs.push(log);
    }
  
    clearLogs() {
      this.logs = [];
    }
  
    getLogs() {
      return this.logs;
    }
  }
  
  const log = new Log();
  
  export default log;