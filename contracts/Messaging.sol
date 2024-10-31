// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./interfaces/IMessaging.sol";
import "./interfaces/IErrors.sol";
import {Subcall} from "@oasisprotocol/sapphire-contracts/contracts/Subcall.sol";

contract Messaging is IMessaging, IErrors {
    /// @notice The ROFL app ID
    bytes21 public roflAppID;

    /// @notice Counter for generating unique group IDs
    uint256 private nextGroupId = 1;

    /// @notice Stores direct messages between two users
    /// @dev Maps sender => receiver => array of messages
    mapping(address => mapping(address => Message[])) private directMessages;

    /// @notice Stores group information
    /// @dev Maps groupId => Group struct
    mapping(uint256 => Group) private groups;

    /// @notice Stores messages for each group
    /// @dev Maps groupId => array of messages
    mapping(uint256 => Message[]) private groupMessages;

    /// @notice Tracks which groups a user is a member of
    /// @dev Maps user address => array of groupIds
    mapping(address => uint256[]) private userGroups;

    /// @notice Stores addresses that the caller has exchanged messages with
    /// @dev Maps user address => array of addresses
    mapping(address => address[]) private userContacts;

    /// @notice Tracks whether a user has exchanged messages with another user
    /// @dev Maps user address => mapping of addresses => bool
    mapping(address => mapping(address => bool)) private isContact;

    constructor(bytes21 _roflAppID) {
        roflAppID = _roflAppID;
    }

    /// @notice Sends a direct message to another user
    /// @param to The recipient's address
    /// @param content The message content
    /// @dev Emits DirectMessageSent event
    function sendDirectMessage(address to, string calldata content) external {
        if (to == address(0)) revert InvalidRecipient();
        if (to == msg.sender) revert CannotMessageSelf();

        Message memory newMessage = Message({
            sender: msg.sender,
            content: content,
            timestamp: block.timestamp
        });

        (address addr1, address addr2) = _getMessageKey(msg.sender, to);
        directMessages[addr1][addr2].push(newMessage);

        // Add contact tracking
        if (!isContact[msg.sender][to]) {
            userContacts[msg.sender].push(to);
            isContact[msg.sender][to] = true;
        }
        if (!isContact[to][msg.sender]) {
            userContacts[to].push(msg.sender);
            isContact[to][msg.sender] = true;
        }

        emit DirectMessageSent(msg.sender, to, content);
    }

    /// @notice Creates a new group with access criteria
    /// @param name The name of the group
    /// @param chainId The chain ID where token balance will be checked
    /// @param tokenAddress The address of the token contract
    /// @param requiredAmount The minimum amount of tokens required
    /// @return groupId The ID of the newly created group
    function createGroup(
        string calldata name,
        uint256 chainId,
        address tokenAddress,
        uint256 requiredAmount
    ) external returns (uint256) {
        if (bytes(name).length == 0) revert EmptyGroupName();
        if (tokenAddress == address(0)) revert InvalidTokenAddress();
        if (requiredAmount == 0) revert InvalidRequiredAmount();

        address[] memory members = new address[](1);
        members[0] = msg.sender;
        userGroups[msg.sender].push(nextGroupId);

        uint256 groupId = nextGroupId++;
        groups[groupId] = Group({
            name: name,
            members: members,
            criteria: GroupCriteria({
                chainId: chainId,
                tokenAddress: tokenAddress,
                requiredAmount: requiredAmount
            }),
            exists: true
        });

        emit GroupCreated(groupId, name, msg.sender);
        return groupId;
    }

    /// @notice Sends a message to a group
    /// @param groupId The ID of the target group
    /// @param content The message content
    /// @dev Only group members can send messages
    function sendGroupMessage(
        uint256 groupId,
        string calldata content
    ) external {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (!isGroupMember(groupId, msg.sender)) revert NotGroupMember();

        Message memory newMessage = Message({
            sender: msg.sender,
            content: content,
            timestamp: block.timestamp
        });

        groupMessages[groupId].push(newMessage);

        emit GroupMessageSent(groupId, msg.sender, content);
    }

    /// @notice Adds a new member to an existing group
    /// @param groupId The ID of the group
    /// @param newMember The address of the new member
    /// @dev Only existing group members can add new members
    function addGroupMember(uint256 groupId, address newMember) external {
        // Only the authorized ROFL app can submit.
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);

        if (!groups[groupId].exists) revert GroupDoesNotExist();
        // if (!isGroupMember(groupId, msg.sender)) revert OnlyMembersCanAdd();
        if (newMember == address(0)) revert InvalidMemberAddress();
        if (isGroupMember(groupId, newMember)) revert AlreadyGroupMember();

        groups[groupId].members.push(newMember);
        userGroups[newMember].push(groupId);

        emit MemberAdded(groupId, newMember, msg.sender);
    }

    /// @notice Removes a member from an existing group
    /// @param groupId The ID of the group
    /// @param memberToRemove The address of the member to remove
    /// @dev Only existing group members can remove other members
    /// @dev A member cannot remove themselves
    function removeGroupMember(
        uint256 groupId,
        address memberToRemove
    ) external {
        // Only the authorized ROFL app can submit.
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);

        if (!groups[groupId].exists) revert GroupDoesNotExist();
        // if (!isGroupMember(groupId, msg.sender)) revert NotGroupMember();
        if (!isGroupMember(groupId, memberToRemove)) revert NotGroupMember();
        if (memberToRemove == msg.sender) revert CannotRemoveSelf();

        // Remove from members array
        address[] storage members = groups[groupId].members;
        uint256 membersLength = members.length;
        for (uint i = 0; i < membersLength; i++) {
            if (members[i] == memberToRemove) {
                members[i] = members[membersLength - 1];
                members.pop();
                break;
            }
        }

        // Remove from user's group list
        uint256[] storage userGroupList = userGroups[memberToRemove];
        uint256 groupsLength = userGroupList.length;
        for (uint i = 0; i < groupsLength; i++) {
            if (userGroupList[i] == groupId) {
                userGroupList[i] = userGroupList[groupsLength - 1];
                userGroupList.pop();
                break;
            }
        }

        emit MemberRemoved(groupId, memberToRemove, msg.sender);
    }

    /// @notice Retrieves direct messages between caller and another user
    /// @param otherUser The address of the other user
    /// @return Array of Message structs
    function getDirectMessages(
        address otherUser
    ) external view returns (Message[] memory) {
        (address addr1, address addr2) = _getMessageKey(msg.sender, otherUser);
        return directMessages[addr1][addr2];
    }

    /// @notice Retrieves messages for a specific group
    /// @param groupId The ID of the target group
    /// @return Array of Message structs
    function getGroupMessages(
        uint256 groupId
    ) external view returns (Message[] memory) {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (!isGroupMember(groupId, msg.sender)) revert NotGroupMember();
        return groupMessages[groupId];
    }

    /// @notice Retrieves details about a specific group
    /// @param groupId The ID of the target group
    /// @return name The name of the group
    /// @return members Array of addresses of group members
    function getGroupDetails(
        uint256 groupId
    ) external view returns (string memory name, address[] memory members) {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        return (groups[groupId].name, groups[groupId].members);
    }

    /// @notice Retrieves groups a user is a member of
    /// @return Array of group IDs
    function getUserGroups() external view returns (uint256[] memory) {
        return userGroups[msg.sender];
    }

    /// @notice Retrieves groups a specific user is a member of
    /// @param user The address of the user
    /// @return Array of group IDs
    function getUserGroupsByAddress(
        address user
    ) external view returns (uint256[] memory) {
        return userGroups[user];
    }

    /// @notice Retrieves all addresses that the caller has exchanged messages with
    /// @return Array of addresses that the caller has DM history with
    function getDirectMessageContacts() external view returns (address[] memory) {
        return userContacts[msg.sender];
    }

    /// @notice Checks if a user is a member of a specific group
    /// @param groupId The ID of the target group
    /// @param user The address of the user
    /// @return bool True if the user is a member of the group, false otherwise
    function isGroupMember(
        uint256 groupId,
        address user
    ) public view returns (bool) {
        address[] memory members = groups[groupId].members;
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == user) {
                return true;
            }
        }
        return false;
    }

    /// @notice Helper function to get the key for direct messages
    /// @param addr1 The address of the first user
    /// @param addr2 The address of the second user
    /// @return address The address of the first user
    /// @return address The address of the second user
    function _getMessageKey(
        address addr1,
        address addr2
    ) private pure returns (address, address) {
        return addr1 < addr2 ? (addr1, addr2) : (addr2, addr1);
    }
}
