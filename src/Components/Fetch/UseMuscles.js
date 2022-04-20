import { useState, useEffect } from 'react';

export default function UseSholders() {
  const [sholder, setSholder] = useState([]);
  const [arms, setArms] = useState([]);
  const [legs, setLegs] = useState([]);
  const [abs, setAbs] = useState([]);
  const [chest, setChest] = useState([]);
  const [back, setBack] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getMuscles();
  }, []);

  console.log(sholder);
  async function getMuscles() {
    const responseSholders = await fetch(
      'https://wger.de/api/v2/exercise/?limit=500&muscles=2&language=1'
    );
    const responseArms = await fetch(
      'https://wger.de/api/v2/exercise/?limit=500&muscles=1,13,5&language=1'
    );
    const responseLegs = await fetch(
      'https://wger.de/api/v2/exercise/?limit=500&muscles=7,8,10,15,11&language=1'
    );
    const responseAbs = await fetch(
      'https://wger.de/api/v2/exercise/?limit=500&muscles=14,6&language=1'
    );
    const responseChest = await fetch(
      'https://wger.de/api/v2/exercise/?limit=500&muscles=4&language=1'
    );
    const responseBack = await fetch(
      'https://wger.de/api/v2/exercise/?limit=500&muscles=12,3,9&language=1'
    );
    const responseimages = await fetch(
      'https://wger.de/api/v2/exerciseimage/?limit=500'
    );
    const dataSholders = await responseSholders.json();
    const dataArms = await responseArms.json();
    const dataLegs = await responseLegs.json();
    const dataAbs = await responseAbs.json();
    const dataChest = await responseChest.json();
    const dataBack = await responseBack.json();
    const dataImages = await responseimages.json();

    setSholder(dataSholders.results);
    setArms(dataArms.results);
    setLegs(dataLegs.results);
    setAbs(dataAbs.results);
    setChest(dataChest.results);
    setBack(dataBack.results);
    setImages(dataImages.results);
  }

  return { sholder, arms, legs, abs, chest, back, images };
}
