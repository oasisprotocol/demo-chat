// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IErrors {
    /// @notice Thrown when attempting to send a message to an invalid address (zero address)
    error InvalidRecipient();

    /// @notice Thrown when attempting to send a direct message to oneself
    error CannotMessageSelf();

    /// @notice Thrown when attempting to create a group with an empty name
    error EmptyGroupName();

    /// @notice Thrown when attempting to interact with a group that doesn't exist
    error GroupDoesNotExist();

    /// @notice Thrown when a non-member attempts to access group functions
    error NotGroupMember();

    /// @notice Thrown when attempting to add an invalid address (zero address) to a group
    error InvalidMemberAddress();

    /// @notice Thrown when attempting to add an address that is already a group member
    error AlreadyGroupMember();

    /// @notice Thrown when a non-member attempts to add new members to a group
    error OnlyMembersCanAdd();

    /// @notice Thrown when a member attempts to remove themselves from a group
    error CannotRemoveSelf();
}
