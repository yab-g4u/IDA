import { supabase } from "./supabase-client"

// Types for marketplace
export interface Transaction {
  id: string
  user_id: string
  medicine_name: string
  pharmacy: string
  amount: number
  status: "completed" | "pending" | "failed"
  token_reward: number
  tx_hash: string
  created_at: string
}

// Save transaction to Supabase
export const saveTransaction = async (
  userId: string,
  medicineName: string,
  pharmacy: string,
  amount: number,
  tokenReward: number,
  txHash: string,
  status: "completed" | "pending" | "failed" = "completed",
) => {
  try {
    const { data, error } = await supabase.from("transactions").insert({
      user_id: userId,
      medicine_name: medicineName,
      pharmacy,
      amount,
      status,
      token_reward: tokenReward,
      tx_hash: txHash,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving transaction:", error)
    throw error
  }
}

// Get user transactions from Supabase
export const getUserTransactions = async (userId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Transaction[]
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}

// Update transaction status
export const updateTransactionStatus = async (transactionId: string, status: "completed" | "pending" | "failed") => {
  try {
    const { data, error } = await supabase.from("transactions").update({ status }).eq("id", transactionId)

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating transaction:", error)
    throw error
  }
}
