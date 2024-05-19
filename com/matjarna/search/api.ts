import commInstance from '../communicator/comm';

export const searchProducts = async (
  page: number,
  title: string,
  language: string,
  country: string,
): Promise<any> => {
  const response = await commInstance.get(`api/product/`, {
    params: {
      page: page,
      searchTerm: title,
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
