export const mockUser = {
  userId: "1",
  name: 'Mock User',
  dob: '12/1/1995',
  email: ['bob@mail.com'],
};

export const mockUser2 = { ...mockUser, email: [] };

export const mockBadUser_UserId = {
  userId: 1,
  name: 'Mock User',
  dob: '12/1/1995',
  email: ['bob@mail.com'],
};

export const mockBadUser_Name = {
  userId: '1',
  name: 12,
  dob: '12/1/1995',
  email: ['bob@mail.com'],
};

export const mockBadUser_UserIdName = {
  userId: 1,
  name: 12,
  dob: '12/1/1995',
  email: ['bob@mail.com'],
};
