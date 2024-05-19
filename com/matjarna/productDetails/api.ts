import commInstance from '../communicator/comm';

export const fetchProductDetails = async (
  id: number,
  language: string,
  country: string,
): Promise<any> => {
  const response = await commInstance.get(`api/product/${id}`, {
    params: {
      language: language,
      country: country,
    },
  });
  if (response.status < 300) {
    return response.data;
  } else {
    return Promise.reject();
  }
};
