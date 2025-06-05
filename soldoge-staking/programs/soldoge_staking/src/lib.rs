use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer, Burn, MintTo};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkgEoYy3z2i5A"); // Replace with deployed ID

const DAILY_RATE_BPS: u64 = 50; // 0.5%
const VESTING_PERIOD: i64 = 7 * 86400; // 7 days
const BURN_BPS: u64 = 200; // 2%
const FEE_BPS: u64 = 300; // 3%

#[program]
pub mod soldoge_staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let user = &mut ctx.accounts.user_state;
        user.owner = ctx.accounts.user.key();
        user.amount_staked = 0;
        user.last_stake_time = Clock::get()?.unix_timestamp;
        user.total_rewards = 0;
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user_state;
        let clock = Clock::get()?;
        user.amount_staked += amount;
        user.last_stake_time = clock.unix_timestamp;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        let user = &mut ctx.accounts.user_state;
        let now = Clock::get()?.unix_timestamp;

        let time_passed = now - user.last_stake_time;
        require!(time_passed > 0, CustomError::NothingToClaim);

        let reward = (user.amount_staked as u128)
            * (DAILY_RATE_BPS as u128)
            * (time_passed as u128)
            / 86400 / 10_000;

        let reward = reward as u64;
        let burn_amount = reward * BURN_BPS / 10_000;
        let fee_amount = reward * FEE_BPS / 10_000;
        let payout = reward - burn_amount - fee_amount;

        // Mint payout to user
        let mint_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.reward_mint.to_account_info(),
                to: ctx.accounts.user_token.to_account_info(),
                authority: ctx.accounts.mint_authority.clone(),
            },
        );
        token::mint_to(mint_ctx, payout)?;

        // Burn tokens
        let burn_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.reward_mint.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.mint_authority.clone(),
            },
        );
        token::burn(burn_ctx, burn_amount)?;

        // Send dev fee
        let fee_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.dev_wallet.to_account_info(),
                authority: ctx.accounts.mint_authority.clone(),
            },
        );
        token::transfer(fee_ctx, fee_amount)?;

        user.total_rewards += payout;
        user.last_stake_time = now;
        Ok(())
    }
}
