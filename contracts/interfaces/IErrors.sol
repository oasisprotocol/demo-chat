// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IErrors {
    /// @notice Thrown when a sign-in attempt has expired
    error SignInExpired();

    /// @notice Thrown when the signature provided for sign-in is invalid
    error InvalidSignIn();

    /// @notice Thrown when attempting to send a message to an invalid address (zero address)
    error InvalidRecipient();

    /// @notice Thrown when attempting to send a direct message to oneself
    error CannotMessageSelf();

    /// @notice Thrown when attempting to create a group with an empty name
    error EmptyGroupName();

    /// @notice Thrown when the provided token address is invalid (likely zero address)
    error InvalidTokenAddress();

    /// @notice Thrown when the required token amount specified is invalid (likely zero)
    error InvalidRequiredAmount();

    /// @notice Thrown when attempting to add a member that is already in pending status
    error AlreadyPending();

    /// @notice Thrown when attempting to interact with a member that is not in pending status
    error NotPendingMember();

    /// @notice Thrown when attempting to interact with a group that doesn't exist
    error GroupDoesNotExist();

    /// @notice Thrown when a non-member attempts to access group functions
    error NotGroupMember();

    /// @notice Thrown when attempting to add an invalid address (zero address) to a group
    error InvalidMemberAddress();

    /// @notice Thrown when attempting to add an address that is already a group member
    error AlreadyGroupMember();

    /// @notice Thrown when a non-member attempts to add new members to a group
    // error OnlyMembersCanAdd();

    /// @notice Thrown when a member attempts to remove themselves from a group
    error CannotRemoveSelf();
}
