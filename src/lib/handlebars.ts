import {format, TDate} from 'timeago.js';

class HbarsHelpers{
    public timeago(timestamp: TDate): string{
        return format(timestamp);
    }
}

const hbarsHelper = new HbarsHelpers();
export default hbarsHelper;