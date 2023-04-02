import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addOrUpdateCart, getCart, removeFromCart } from '../api/firebase';
import { useAuthContext } from '../context/AuthContext';

export default function useCart() {
  const { uid } = useAuthContext();
  const queryClient = useQueryClient();

  const cartQuery = useQuery(['cart', uid || ''], () => getCart(uid), {
    enable: !!uid
  });

  const addOrUpdateItem = useMutation(
    (product) => addOrUpdateCart(uid, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['carts', uid]);
      }
    }
  );

  const removeItem = useMutation((id) => removeFromCart(uid, id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['carts', uid]);
    }
  });

  return { cartQuery, addOrUpdateItem, removeItem };
}
