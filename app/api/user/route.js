"use server"

import { NextResponse } from "next/server";

let user = [];

export async function GET() {
    return NextResponse.json(user);
}

export async function POST(req){
    let body = await req.json();
    let newData = {...body,id:Date.now()};
    user.push(newData);
    return NextResponse.json(newData);
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
        return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    user = user.filter((val) => val.id !== id);
    return NextResponse.json({ message: "User deleted" });
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
        return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    const body = await req.json();
    const index = user.findIndex((val) => val.id === id);

    if (index === -1) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user[index] = { ...user[index], ...body, id };
    return NextResponse.json(user[index]);
}
