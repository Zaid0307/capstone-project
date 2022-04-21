import { useState, useEffect } from 'react';

export default function UseMuscles() {
  const [shoulders, setShoulders] = useState([]);
  const [arms, setArms] = useState([]);
  const [legs, setLegs] = useState([]);
  const [abs, setAbs] = useState([]);
  const [chest, setChest] = useState([]);
  const [back, setBack] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function getMuscles() {
      const responseShoulders = await fetch(
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

      const dataShoulders = await responseShoulders.json();
      const dataArms = await responseArms.json();
      const dataLegs = await responseLegs.json();
      const dataAbs = await responseAbs.json();
      const dataChest = await responseChest.json();
      const dataBack = await responseBack.json();
      const dataImages = await responseimages.json();

      setShoulders(dataShoulders.results);
      setArms(dataArms.results);
      setLegs(dataLegs.results);
      setAbs(dataAbs.results);
      setChest(dataChest.results);
      setBack(dataBack.results);
      setImages(dataImages.results);
    }
    getMuscles();
  }, []);
  return { shoulders, arms, legs, abs, chest, back, images };
}
