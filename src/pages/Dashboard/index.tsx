import { Component, useEffect, useState } from 'react';

import {Header} from '../../components/Header';
import api from '../../services/api';
import {Food} from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Food{
  id: number,
  name: string,
  description: string,
  price: string,
  available: boolean,
  image: string
}

export function Dashboard(){
  const [foods, setFoods]= useState<Food[]>([]
      //editingFood: {},
      //modalOpen: false,
      //editModalOpen: false,
    );
  const [editingFood, setEditingFood] = useState<Food>({} as Food);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  useEffect(()=>{
    async function getFoods(){
      const response = await api.get('/foods');
      return response
    }
    getFoods()
    .then(response=>setFoods(response.data));
  },[])

  async function handleAddFood(food: Food){
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food:Food){

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id:number){

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal(){
    setModalOpen((oldModalOpen)=> !oldModalOpen);
  }

  function toggleEditModal(){
    setEditModalOpen((oldEditModalOpen) => !oldEditModalOpen);
  }

  function handleEditFood(food:Food){
    setEditingFood(food);
    setEditModalOpen(true)
    //this.setState({ editingFood: food, editModalOpen: true });
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

