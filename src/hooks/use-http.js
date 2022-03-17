import { useReducer } from "react";

const initialState = {isLoading: false, data: null, error: false}
const stateReducer = (state, action) => {
    switch (action.type) {
        case 'LOADING' :
            return {isLoading: true, data: null, error: false}
        case 'ERROR' :
            return {isLoading: false, data: null, error: action.errorMessage}
        case 'SUCCESS' :
            return {isLoading: false, data: action.data, error: false}
    }

    return initialState
}

const useHttp = () => {
    const [state, dispatchState] = useReducer(stateReducer, initialState)

    const sendRequest = async (url, options) => {
        dispatchState({type:'LOADING'})
        try {
          const response = await fetch(`https://react-http-42cd7-default-rtdb.firebaseio.com/${url}.json`, options);
    
          if (!response.ok) {
            //응답값에 'ok', 'status' 필드로 정상 거래 여부 판단함
            throw new Error("Something went wrong!");
          }
    
          const data = await response.json();
          dispatchState({type:'SUCCESS', data: data})
        } catch (e) {
            dispatchState({type:'ERROR', errorMessage: e.message})
        }
      };

      return {
          data : state.data,
          isLoading : state.isLoading,
          error : state.error,
          sendRequest
      }
}

export default useHttp