import CreateForm from '../Components/CreateForm';
import { useState } from 'react';
import DayForm from '../Components/DayForm';

export default function Form() {
  const [formInfo, setFormInfo] = useState([]);
  const [days, setDays] = useState([]);
  const [toggleForm, setToggleForm] = useState(false);

  console.log('formInfo', formInfo);
  console.log('Days', days);

  const selcetedDays = Object.keys(days).filter(obj => days[obj]);

  return (
    <>
      {!toggleForm ? (
        <CreateForm
          handleSubmit={handleCreateForm}
          onCheck={onCheck}
          onChange={onChange}
        />
      ) : (
        <p>no info here</p>
      )}
    </>
  );

  function handleCreateForm(event) {
    event.preventDefault();
    setToggleForm(true);
  }

  function onCheck(event) {
    const { name, checked } = event.target;
    setDays([...days, { [name]: checked }]);
  }

  function onChange(event) {
    const { name, value } = event.target;
    setFormInfo([...formInfo, { [name]: value }]);
  }
}
