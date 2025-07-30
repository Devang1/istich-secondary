export const createAuthSlice=(set)=>(
{
    userinfo:"not authenticated",
    setuserinfo:(userinfo)=>set({userinfo})
}
)
