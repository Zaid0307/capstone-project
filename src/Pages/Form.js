import CreateForm from '../Components/CreateForm';
import { useState } from 'react';
import DayForm from '../Components/DayForm';

export default function Form() {
  const [formInfo, setFormInfo] = useState([]);
  const [days, setDays] = useState([
    {
      monday: '',
      tuseday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    },
  ]);

  console.log(formInfo);
  console.log(days);

  const selcetedDays = Object.keys(days).filter(obj => days[obj]);

  return (
    <>
      {formInfo && <CreateForm handleSubmit={handleCreateForm} />}
      {!formInfo && <p>no info here</p>}
    </>
  );

  function handleCreateForm(event) {
    event.preventDefault();
    const { name, value } = event.target;
    setDays({
      ...days,
      [name]: value,
    });
    setFormInfo({
      ...formInfo,
      [name]: value,
    });
  }

  /*  function onCheck(event) {
    const { name, checked } = event.target;
    setDays({
      ...days,
      [name]: checked,
    });
  }

  function onChange(event) {
    const { name, value } = event.target;
    setFormInfo({
      ...formInfo,
      [name]: value,
    });
  }*/
}
