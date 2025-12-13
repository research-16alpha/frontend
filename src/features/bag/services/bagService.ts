import { addToBag as apiAddToBag, removeFromBag as apiRemoveFromBag, getBag as apiGetBag } from '../../auth/api/auth';

/**
 * Service for managing user's bag (shopping bag)
 */
export class BagService {
  /**
   * Add a product to the user's bag
   * @param userId - The ID of the user
   * @param productId - The ID of the product to add
   * @returns Promise that resolves to the updated bag list
   * @throws Error if the operation fails
   */
  static async addToBag(userId: string, productId: string): Promise<string[]> {
    try {
      const bag = await apiAddToBag(userId, productId);
      return bag;
    } catch (error) {
      console.error('Error adding to bag:', error);
      throw new Error('Failed to add product to bag');
    }
  }

  /**
   * Remove a product from the user's bag
   * @param userId - The ID of the user
   * @param productId - The ID of the product to remove
   * @returns Promise that resolves to the updated bag list
   * @throws Error if the operation fails
   */
  static async removeFromBag(userId: string, productId: string): Promise<string[]> {
    try {
      const bag = await apiRemoveFromBag(userId, productId);
      return bag;
    } catch (error) {
      console.error('Error removing from bag:', error);
      throw new Error('Failed to remove product from bag');
    }
  }

  /**
   * Get the user's bag
   * @param userId - The ID of the user
   * @returns Promise that resolves to the bag list
   * @throws Error if the operation fails
   */
  static async getBag(userId: string): Promise<string[]> {
    try {
      const bag = await apiGetBag(userId);
      return bag;
    } catch (error) {
      console.error('Error fetching bag:', error);
      throw new Error('Failed to fetch bag');
    }
  }
}

