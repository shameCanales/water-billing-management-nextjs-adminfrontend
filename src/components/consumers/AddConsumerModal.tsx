import { useAddConsumer } from "@/hooks/useAddConsumer";
import { uiActions } from "@/lib/store/uiSlice";
import { useDispatch } from "react-redux";

export default function AddConsumerModal() {
  const dispatch = useDispatch();

  const {
    mutate: createConsumer,
    isPending: isCreatingConsumer,
    isError: errorCreatingConsumer,
    error: createConsumerError,
  } = useAddConsumer();

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   createConsumer(
  //     {
  //       firstName,
  //       middleName, //optional
  //       lastName,
  //       email,
  //       birthDate,
  //       mobileNumber,
  //       password,
  //       address,
  //       status,
  //     },
  //     {
  //       onSuccess: (data) => {
  //         console.log(data);
  //         dispatch(uiActions.closeAddConsumerModal());
  //       },
  //       onError: (error) => {
  //         console.error("Error creating consumer:", error);
  //       },
  //     }
  //   );
  // };

  return (
    <div className="absolute top-0 right-0">
      <h1>Add Consumer Modal</h1>
      <button
        onClick={() => dispatch(uiActions.closeAddConsumerModal())}
        className="text-red-900"
      >
        Close Modal
      </button>
    </div>
  );
}
