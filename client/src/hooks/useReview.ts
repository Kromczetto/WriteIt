import { useEffect, useState } from 'react';
import axios from 'axios';

export const useReview = (workId: string) => {
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/review/${workId}`)
      .then(res => {
        setAverage(res.data.average);
        setCount(res.data.count);
      })
      .finally(() => setLoading(false));
  }, [workId]);

  const rate = async (value: number) => {
    setMyRating(value);
    await axios.post(`/review/${workId}`, {
      rating: value,
    });


    const res = await axios.get(`/review/${workId}`);
    setAverage(res.data.average);
    setCount(res.data.count);
  };

  return {
    average,
    count,
    myRating,
    rate,
    loading,
  };
};
