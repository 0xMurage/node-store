interface User {
    id: number,
    name: string,
    code: string,
    role: {
        id: number,
        name: string,
    },
    permissions: { id: number, name: string } []
}
