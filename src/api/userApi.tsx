import {api} from './index'


export const userApi = {
    getUsers: async (limit: number = 10, page: number = 1) => {
      try {
        const response = await api.get('users/get_users', {
          params: { limit, page },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },

    updateUser: async (formData) => {
        try {
          const response = await api.post('users/update/', formData);
          return response;
        } catch (error) {
          console.error("Error updating user", error);
          throw error;
        }
      },


      addUser: async (formData) => {
        try {
          const response = await api.post('users/signup/', formData);
          return response;
        } catch (error) {
          console.error("Error updating user", error);
          throw error;
        }
      },


      deleteUser: async (id) => {
        try {
          const response = await api.delete(`users/delete/${id}`);
          return response;
        } catch (error) {
          console.error("Error updating user", error);
          throw error;
        }
      },



  };



  