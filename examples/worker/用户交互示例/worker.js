let data;

const setData = (receivedData) => data = receivedData;
const filterDataByUserValue = (data, userValue) => {
  const regExp = new RegExp(userValue);
  return data.filter(dataItem => regExp.test(dataItem));
};

this.onmessage = (event) => {
  const { type, data: userData } = event.data;
  if (type === 'set') setData(userData);
  else {
    const matchedData = filterDataByUserValue(data, userData);
    this.postMessage(matchedData);
  }
}
