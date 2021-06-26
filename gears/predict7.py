import datetime
import pandas as pd
from prophet import Prophet


def predict(key, period):
    # Labels
    it = iter(execute('TS.INFO', key))
    info = dict(zip(it, it))
    labels = [item for sublist in info["labels"] for item in sublist]
    labels.append('future')
    labels.append(str(period))

    # yhat
    yhat = key + ':' + str(period) + ':yhat'
    (yhat_lower, yhat_upper) = (yhat + '_lower', yhat + '_upper')

    # Create new Time-series
    execute('DEL', yhat, yhat_lower, yhat_upper)
    execute('TS.CREATE', yhat, 'LABELS', *labels)
    execute('TS.CREATE', yhat_lower, 'LABELS', *labels)
    execute('TS.CREATE', yhat_upper, 'LABELS', *labels)

    start_date = round(
        (datetime.datetime.now() - datetime.timedelta(period)).timestamp()*1000)

    # Query Range
    r = execute('TS.RANGE',  key, start_date, '+')
    df = pd.DataFrame.from_records(r, columns=['ds', 'y'])
    df['ds'] = pd.to_datetime(df['ds'], unit='ms')

    # Fit Prophet model    ​
    m = Prophet()
    m.fit(df)

    # Create dataframe with the dates
    future = m.make_future_dataframe(periods=int(period))
    forecast = m.predict(future)

    # Forecast
    for index, row in forecast[len(df):].iterrows():
        millisec = round(row['ds'].timestamp()*1000)
        execute('TS.MADD', yhat, millisec, row['yhat'], yhat_lower, millisec,
                row['yhat_lower'], yhat_upper, millisec, row['yhat_upper'])


gb = GearsBuilder()
gb.foreach(lambda x: predict(x['key'], 7))
gb.run('{*CLOSE}')
