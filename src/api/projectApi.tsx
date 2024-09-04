import {api} from './index'


export const projectApi = {
    getProjects: async (limit: number = 10, page: number = 1,search?: string,status?:string,division?: string) => {
      try {
        const params: any = { limit, page };
    
    if (search) {
      params.search = search;
    }
    if (status && status!='All') {
      params.status = status;
    }

    if (division) {
      params.division = division;
    }
        const response = await api.get('project/list', {
          params,
        });
        return response
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },

    // updateUser: async (formData) => {
    //     try {
    //       const response = await api.post('users/update/', formData);
    //       return response;
    //     } catch (error) {
    //       console.error("Error updating user", error);
    //       throw error;
    //     }
    //   },


    //   addUser: async (formData) => {
    //     try {
    //       const response = await api.post('users/signup/', formData);
    //       return response;
    //     } catch (error) {
    //       console.error("Error updating user", error);
    //       throw error;
    //     }
    //   },


    //   deleteUser: async (id) => {
    //     try {
    //       const response = await api.delete(`users/delete/${id}`);
    //       return response;
    //     } catch (error) {
    //       console.error("Error updating user", error);
    //       throw error;
    //     }
    //   },



  };



  