
export const insertRow = (row, collection) => {
    const [x, y] = row.coordinate.split(',');

    const query = { user_id: row.user_id };
    const update = {
        $inc: {
            nb_pixels: 1
        },
        $push : {
            pixels: {
                timestamp: row.timestamp,
                pixel_color: row.pixel_color,
                coordinate: {
                    x: x,
                    y: y,
                },
            }
        }
    };
    const options = { upsert: true };
    return collection.updateOne(query, update, options);
};
