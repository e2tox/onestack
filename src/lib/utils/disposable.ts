
export interface IDisposable {

  /**
   * Finalizer method
   * @param disposing disposing:true Dispose method called. disposing:false process.exit.
   * @private
   */
  dispose(disposing: boolean): void;

}
