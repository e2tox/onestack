import { PassThrough } from 'stream';

export class ConsoleTransformer extends PassThrough {

  private formatter: ConsoleFormatter;

  constructor() {
    super({ objectMode: true });
    this.formatter = new ConsoleFormatter();

    // NOTE: MEMORY LEAK POINT:
    // stream.pipe(stream) will add a reference of current stream object to second stream
    // so this stream will never able to release because the reference is hold by second stream which is global object.
    // changing to GOOD code will overcome this memory leak issue
    //
    // BAD:
    // this.pipe(process.stdout)
    // end of BAD
    //
    // GOOD
    this.on('data', (data) => {
      process.stdout.write(data);
    });
    // end of GOOD

  }

  _transform(data: string, enc: string, next: Function) {
    this.push(this.formatter.format(JSON.parse(data)));
    next();
  };

}

export class ConsoleFormatter {

  private static colors = {
    'bold': [1, 22],
    'italic': [3, 23],
    'underline': [4, 24],
    'inverse': [7, 27],
    'white': [37, 39],
    'grey': [90, 39],
    'black': [30, 39],
    'blue': [34, 39],
    'cyan': [36, 39],
    'green': [32, 39],
    'magenta': [35, 39],
    'red': [31, 39],
    'yellow': [33, 39]
  };

  private levels = {
    10: ['TRACE', 'grey'],     // TRACE
    20: ['DEBUG', 'cyan'],     // DEBUG
    30: ['INFO ', 'green'],    // INFO
    40: ['WARN ', 'yellow'],   // WARN
    50: ['ERROR', 'magenta'],  // ERROR
    60: ['FATAL', 'red']       // FATAL
  };

  public static stylize(text: string, color: string = 'white'): string {
    const codes = ConsoleFormatter.colors[color];
    return `\x1B[${codes[0]}m${text}\x1B[${codes[1]}m`;
  }

  public format(data: any): string {

    const details = [];
    const extras = [];
    const time = this.extractTime(data);
    const level = this.extractLevel(data);
    const isSingleLineMsg = this.isSingleLineMsg(data);
    const msg = isSingleLineMsg ? this.extractMsg(data) : '';
    if (!isSingleLineMsg) {
      details.push(this.indent(this.extractMsg(data)));
    }

    const error = this.extractError(data);
    if (error) {
      details.push(this.indent(error));
    }

    this.applyDetails(this.extractCustomDetails(data), details, extras);

    const prettyExtras = !extras.length ? '' : ConsoleFormatter.stylize(' (' + extras.join(', ') + ')', 'cyan');
    const prettyDetails = !details.length ? '' : ConsoleFormatter.stylize(details.join('\n\t--\n') + '\n', 'grey');

    return `[${time}] ${level}: ${msg}${prettyExtras}\n${prettyDetails}`;
  }

  private indent(text: string) {
    return '\t' + text.split(/\r?\n/).join('\n\t');
  }

  private extractTime(data) {
    const time = data.time;
    if (time[10] === 'T') {
      return ConsoleFormatter.stylize(time.substr(11));
    }
    else {
      return ConsoleFormatter.stylize(time);
    }
  }

  private extractLevel(data) {
    const level = this.levels[data.level];
    return ConsoleFormatter.stylize(level[0], level[1]);
  }

  private isSingleLineMsg(data) {
    return data.msg.indexOf('\n') === -1;
  }

  private extractMsg(data) {
    return data.msg;
  }

  private extractError(data) {
    if (data.err && data.err.stack) {
      return data.err.stack;
    }
  }

  private extractCustomDetails(data) {
    const skip = ['name', 'hostname', 'pid', 'level', 'component', 'msg', 'time',
      'v', 'src', 'err', 'client_req', 'client_res', 'req', 'res'];

    const details = [];
    const extras = {};

    Object.keys(data)
      .filter(key => skip.indexOf(key) === -1)
      .forEach(function (key) {
        let value = data[key] || '';
        let stringified = false;
        if (typeof value !== 'string') {
          value = JSON.stringify(value, null, 2);
          stringified = true;
        }
        if (value.indexOf('\n') !== -1 || value.length > 50) {
          details.push(key + ': ' + value);
        } else if (!stringified && (value.indexOf(' ') !== -1 || value.length === 0)) {
          extras[key] = JSON.stringify(value);
        } else {
          extras[key] = value;
        }
      });

    return {
      details: details,
      extras: extras
    };
  }

  private applyDetails(results, details, extras) {
    results.details.forEach((d) => {
      details.push(this.indent(d));
    });
    Object.keys(results.extras).forEach((k) => {
      extras.push(k + '=' + results.extras[k]);
    });
  }

}
